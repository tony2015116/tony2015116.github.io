import { adminPage } from './admin.mjs';

const encoder = new TextEncoder();
const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
};
const pageSize = 20;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...baseHeaders, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function error(status, message) {
  return json({ error: message }, status);
}

async function readJson(request) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json' || !request.body) {
    return null;
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  try {
    const data = JSON.parse(text + decoder.decode());
    return data && typeof data === 'object' && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

async function authorized(request, token) {
  const candidate = request.headers.get('Authorization')?.match(/^Bearer (.{32,256})$/)?.[1];
  if (!candidate) return false;
  const digests = await Promise.all([candidate, token].map(value => crypto.subtle.digest('SHA-256', encoder.encode(value))));
  const [actual, expected] = digests.map(value => new Uint8Array(value));
  let difference = 0;
  for (let index = 0; index < expected.length; index++) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

async function listMessages(env, url, status, includeEmail = false) {
  const before = url.searchParams.get('before');
  const cursor = before === null ? Number.MAX_SAFE_INTEGER : Number(before);
  if (!Number.isSafeInteger(cursor) || cursor < 1) return error(400, '无效的分页位置。');
  const columns = includeEmail ? 'id, name, email, message, created_at' : 'id, name, message, created_at';
  const { results } = await env.DB.prepare(
    `SELECT ${columns} FROM messages WHERE status = ? AND id < ? ORDER BY id DESC LIMIT ?`,
  ).bind(status, cursor, pageSize + 1).all();
  const rows = results.slice(0, pageSize);
  const messages = includeEmail ? rows : rows.map(({ id, ...entry }) => entry);
  return json({ messages, next: results.length > pageSize ? rows.at(-1).id : null });
}

async function submit(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const limit = await env.SUBMISSIONS.limit({ key: ip });
  if (!limit.success) return error(429, '提交太频繁，请稍后再试。');

  const data = await readJson(request);
  if (!data || !['name', 'email', 'message', 'website'].every(field => typeof data[field] === 'string')) {
    return error(400, '请检查表单内容后重试。');
  }
  const submissionId = data.submissionId;
  if (typeof submissionId !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(submissionId)) {
    return error(400, '请刷新留言页后再试。');
  }
  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();
  if (data.website) return error(400, '请重新填写表单。');
  if (!message || message.length > 500 || name.length > 40 || email.length > 254 ||
      (email && !/^[^\s@]+@[^\s@]+$/.test(email))) {
    return error(400, '请填写 1–500 字的留言，并检查称呼和邮箱。');
  }
  await env.DB.prepare(
    'INSERT INTO messages (submission_id, name, email, message, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(submission_id) DO NOTHING',
  ).bind(submissionId, name || '匿名访客', email, message, new Date().toISOString()).run();
  return json({ status: 'pending' }, 201);
}

async function handlePublic(request, env, url) {
  const origin = request.headers.get('Origin');
  const method = request.method;
  if (origin && origin !== env.PUBLIC_ORIGIN) return error(403, '此来源无法访问留言接口。');
  if (method === 'POST' && origin !== env.PUBLIC_ORIGIN) return error(403, '请从主页提交留言。');

  let response;
  if (method === 'OPTIONS') {
    response = new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  } else {
    try {
      if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32) return publicHeaders(error(503, '留言服务尚未启用。'), origin);
      if (method === 'GET') response = await listMessages(env, url, 'approved');
      else if (method === 'POST') response = await submit(request, env);
      else response = error(405, '不支持此请求方式。');
    } catch {
      response = error(503, '留言服务暂不可用，请稍后再试。');
    }
  }
  return publicHeaders(response, origin);
}

function publicHeaders(response, origin) {
  response.headers.set('Vary', 'Origin');
  if (origin) response.headers.set('Access-Control-Allow-Origin', origin);
  return response;
}

async function handleAdmin(request, env, url) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 32) return error(503, '审核服务尚未配置。');
  const path = url.pathname;
  if (path === '/admin' && request.method === 'GET') {
    const nonce = crypto.randomUUID().replaceAll('-', '');
    return new Response(adminPage(nonce), {
      headers: {
        ...baseHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`,
      },
    });
  }
  if (!await authorized(request, env.ADMIN_TOKEN)) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const result = await env.ADMIN_ATTEMPTS.limit({ key: ip });
    return result.success ? error(401, '审核密钥不正确。') : error(429, '尝试过多，请稍后再试。');
  }

  if (path === '/admin/messages' && request.method === 'GET') {
    const status = url.searchParams.get('status') || 'pending';
    if (!['pending', 'approved', 'rejected'].includes(status)) return error(400, '无效的审核状态。');
    return listMessages(env, url, status, true);
  }

  const match = path.match(/^\/admin\/messages\/(\d+)$/);
  const id = match ? Number(match[1]) : null;
  if (request.method !== 'PATCH' || !Number.isSafeInteger(id)) return error(404, '找不到此页面。');

  const data = await readJson(request);
  if (!data || !['approved', 'rejected'].includes(data.status) ||
      !['pending', 'approved', 'rejected'].includes(data.previous) || data.status === data.previous) {
    return error(400, '无效的审核操作。');
  }
  const updated = await env.DB.prepare('UPDATE messages SET status = ? WHERE id = ? AND status = ?')
    .bind(data.status, id, data.previous).run();
  return updated.meta.changes ? json({ status: data.status }) : error(409, '留言状态已更新，请刷新列表。');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/messages') return handlePublic(request, env, url);
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      try {
        return await handleAdmin(request, env, url);
      } catch {
        return error(503, '审核服务暂不可用，请稍后再试。');
      }
    }
    return error(404, '找不到此页面。');
  },
};
