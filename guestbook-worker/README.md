# 留言板部署与审核

该目录是留言接口，主页继续由 GitHub Pages 发布。公开列表只返回已批准留言的称呼、正文和日期。访客邮箱仅在使用审核密钥登录后的后台显示。上线前，请先完成服务部署和联调。

## 部署

1. 使用自己的 Cloudflare 账户运行 `npx wrangler login`，然后在本目录运行 `npx wrangler d1 create mguo-guestbook`。把返回的 UUID 填入 `wrangler.toml` 的 `database_id`。
2. 运行 `npx wrangler d1 migrations apply DB --remote`，再运行 `npx wrangler deploy`。首次部署的接口在设置审核密钥前返回服务未启用。
3. 用密码管理器生成 32 到 64 个字符的随机密钥（仅使用英文字母和数字即可），运行 `npx wrangler secret put ADMIN_TOKEN` 并在提示时输入。密钥只保存在 Cloudflare 的 Secret 设置及自己的密码管理器。
4. 打开部署命令返回的 HTTPS 地址并加上 `/admin`。用审核密钥打开待审核列表。访问同一地址的 `/messages`，确认返回 JSON。
5. 把 Worker 的 HTTPS 根地址填入主页根目录 `_config.yml` 的 `guestbook_api`。主页部署完成后，提交一条测试留言，确认审核前不可见、批准后可见，再从后台撤下。配置为空时顶部导航隐藏留言板入口。
6. 如果更换主页域名，同步更新 `wrangler.toml` 的 `PUBLIC_ORIGIN`，并重新部署 Worker。该值为精确的协议加域名，末尾无需斜杠。

## 日常审核

在 `/admin` 查看「待审核」，选择「批准公开」或「不公开」。在「已公开」里可撤下已公开留言，「未公开」中可重新批准。列表页可加载更早的记录。访客填了邮箱时，你可以按需要自行回复。
