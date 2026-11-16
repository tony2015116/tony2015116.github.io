(() => {
  const guestbook = document.querySelector('[data-guestbook-api]');
  const endpoint = new URL('/messages', guestbook.dataset.guestbookApi);
  const form = document.querySelector('#guestbook-form');
  const message = document.querySelector('#guestbook-message');
  const count = document.querySelector('#guestbook-count');
  const status = document.querySelector('#guestbook-status');
  const submit = form.querySelector('button[type="submit"]');
  const list = document.querySelector('#guestbook-list');
  const listStatus = document.querySelector('#guestbook-list-status');
  const more = document.querySelector('#guestbook-more');
  const dateFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', dateStyle: 'short' });
  let cursor = null;
  let submissionId;
  const fields = form.querySelectorAll("input, textarea");

  async function request(url, options) {
    const response = await fetch(url, { ...options, credentials: 'omit' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '留言服务暂不可用。');
    return data;
  }

  function updateCount() {
    count.textContent = message.value.length + ' / 500 字';
  }

  function render(entry) {
    const row = document.createElement('li');
    const date = document.createElement('time');
    const content = document.createElement('div');
    const name = document.createElement('strong');
    const text = document.createElement('p');

    date.dateTime = entry.created_at;
    date.textContent = dateFormat.format(new Date(entry.created_at));
    name.textContent = entry.name;
    text.textContent = entry.message;
    content.append(name, text);
    row.append(date, content);
    list.append(row);
  }

  async function loadMessages() {
    const url = new URL(endpoint);
    if (cursor !== null) url.searchParams.set('before', cursor);
    more.disabled = true;
    try {
      const data = await request(url);
      data.messages.forEach(render);
      cursor = data.next;
      listStatus.textContent = list.children.length ? '' : '还没有公开留言。';
      more.textContent = '加载更多';
      more.hidden = cursor === null;
    } catch {
      listStatus.textContent = '暂时无法读取留言。';
      more.textContent = '重试';
      more.hidden = false;
    } finally {
      more.disabled = false;
    }
  }

  form.addEventListener('input', () => {
    submissionId = undefined;
    updateCount();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    if (!message.value.trim()) {
      status.textContent = '请输入留言内容。';
      message.focus();
      return;
    }

    submissionId ??= crypto.randomUUID();
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    fields.forEach(field => { field.readOnly = true; });
    status.textContent = '正在提交…';
    try {
      await request(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId }),
      });
      form.reset();
      submissionId = undefined;
      updateCount();
      status.textContent = '留言已提交，审核通过后会在此页公开展示。';
    } catch (failure) {
      status.textContent = (failure instanceof TypeError || failure instanceof SyntaxError)
        ? '暂时无法提交，已保留你填写的内容。请稍后重试。'
        : failure.message;
    } finally {
      fields.forEach(field => { field.readOnly = false; });
      submit.disabled = false;
    }
  });
  more.addEventListener('click', loadMessages);
  submit.disabled = false;
  loadMessages();
})();
