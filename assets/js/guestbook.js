(() => {
  const form = document.querySelector('#guestbook-form');
  const name = document.querySelector('#guestbook-name');
  const message = document.querySelector('#guestbook-message');
  const count = document.querySelector('#guestbook-count');
  const status = document.querySelector('#guestbook-status');
  const email = document.querySelector('#guestbook-email');

  message.addEventListener('input', () => {
    count.textContent = message.value.length + ' / 500 字';
    message.setCustomValidity('');
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const content = message.value.trim();
    if (!content) {
      message.setCustomValidity('请输入留言内容。');
      message.reportValidity();
      return;
    }

    const body = [
      '我同意将以下称呼和留言内容公开在你的主页。',
      '',
      '称呼：' + (name.value.trim() || '访客'),
      '',
      content.replace(/\r?\n/g, '\r\n'),
    ].join('\r\n');
    const draft = email.getAttribute('href') + '&body=' + encodeURIComponent(body);
    status.textContent = '请在邮件应用中确认并发送。若邮件草稿未打开，可复制留言后直接写信。';
    window.location.href = draft;
  });

  form.hidden = false;
})();
