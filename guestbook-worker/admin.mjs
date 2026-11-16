export function adminPage(nonce) {
  return `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>留言审核 · MGUO的主页</title>
<style nonce="${nonce}">
  :root { color-scheme: light dark; }
  body { font: 15px/1.75 system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.5rem; }
  label { display: block; }
  input { width: min(19rem, 90%); }
  button, input, select { font: inherit; padding: .25rem .5rem; margin: .25rem .4rem .25rem 0; }
  article { border-top: 1px solid GrayText; padding: 1rem 0; }
  article p { white-space: pre-wrap; overflow-wrap: anywhere; margin: .5rem 0; }
</style>
<h1>留言审核</h1>
<form id="login">
  <label for="token">审核密钥</label>
  <input id="token" type="password" autocomplete="off" required>
  <button>打开待审核列表</button>
</form>
<p id="notice" role="status"></p>
<section id="moderation" hidden>
  <label for="filter">审核状态</label>
  <select id="filter"><option value="pending">待审核</option><option value="approved">已公开</option><option value="rejected">未公开</option></select>
  <button type="button" id="refresh">刷新</button>
  <button type="button" id="lock">退出审核</button>
  <div id="messages"></div>
  <button type="button" id="more" hidden>加载更多</button>
</section>
<script nonce="${nonce}">
  const login = document.querySelector('#login');
  const tokenInput = document.querySelector('#token');
  const panel = document.querySelector('#moderation');
  const notice = document.querySelector('#notice');
  const filter = document.querySelector('#filter');
  const messages = document.querySelector('#messages');
  const more = document.querySelector('#more');
  let token = '';
  let next = null;
  let busy = false;

  async function api(path, options = {}) {
    const response = await fetch('/admin/messages' + path, {
      ...options,
      headers: { Authorization: 'Bearer ' + token, ...options.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }

  function updateControls() {
    document.querySelectorAll('button, select').forEach(control => {
      control.disabled = busy;
    });
  }

  async function run(action) {
    if (busy) return;
    busy = true;
    notice.textContent = '';
    updateControls();
    try {
      await action();
    } catch (failure) {
      notice.textContent = failure.message || '操作失败，请稍后再试。';
    } finally {
      busy = false;
      updateControls();
    }
  }

  function button(text, onClick) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = text;
    element.addEventListener('click', onClick);
    return element;
  }

  function render(entry, previous) {
    const card = document.createElement('article');
    const heading = document.createElement('strong');
    const date = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', dateStyle: 'medium', timeStyle: 'short' });
    heading.textContent = entry.name + ' · ' + date.format(new Date(entry.created_at));
    const body = document.createElement('p');
    body.textContent = entry.message;
    card.append(heading, body);
    if (entry.email) {
      const email = document.createElement('p');
      email.textContent = '访客邮箱：' + entry.email;
      card.append(email);
    }

    const moderate = status => run(async () => {
      await api('/' + entry.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, previous }),
      });
      card.remove();
      notice.textContent = status === 'approved' ? '留言已公开。' : '留言已设为不公开。';
      if (!messages.children.length && next === null) renderEmpty();
    });

    if (previous !== 'approved') card.append(button('批准公开', () => moderate('approved')));
    if (previous !== 'rejected') card.append(button(previous === 'approved' ? '撤下留言' : '不公开', () => moderate('rejected')));
    messages.append(card);
  }

  function renderEmpty() {
    const empty = document.createElement('p');
    empty.textContent = '当前没有这类留言。';
    messages.append(empty);
  }

  async function load(append = false) {
    const status = filter.value;
    const params = new URLSearchParams({ status });
    if (append && next !== null) params.set('before', next);
    const result = await api('?' + params);
    if (!append) messages.replaceChildren();
    result.messages.forEach(entry => render(entry, status));
    if (!messages.children.length) renderEmpty();
    next = result.next;
    more.hidden = next === null;
  }

  login.addEventListener('submit', event => {
    event.preventDefault();
    run(async () => {
      token = tokenInput.value.trim();
      tokenInput.value = '';
      filter.value = 'pending';
      try {
        await load();
      } catch (failure) {
        token = '';
        throw failure;
      }
      login.hidden = true;
      panel.hidden = false;
      filter.focus();
    });
  });
  filter.addEventListener('change', () => {
    messages.replaceChildren();
    more.hidden = true;
    run(() => load());
  });
  document.querySelector('#refresh').addEventListener('click', () => run(() => load()));
  document.querySelector('#lock').addEventListener('click', () => {
    token = '';
    next = null;
    messages.replaceChildren();
    notice.textContent = '';
    panel.hidden = true;
    login.hidden = false;
    tokenInput.focus();
  });
  more.addEventListener('click', () => run(() => load(true)));
</script>
</html>`;
}
