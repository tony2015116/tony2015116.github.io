#!/usr/bin/env python3
"""部署时给 files/ 下的独立 HTML 页面（教程、速查表、小工具）自动补上：

1. 百度统计：引用 /assets/js/analytics.js（ID 来自 _config.yml 的 baidu_analytics；留空则不加）
2. 分享卡片：og / twitter / itemprop 标签，标题取页面 <title>，
   简介取页面 description；页面没有时取 _data/projects.yml 里对应条目的 description
3. 缺失的 description、author、canonical

只补缺失的部分，页面里已经写了的不会覆盖；只改 _site 里的发布文件，不改仓库源文件。
用法（在 jekyll build 之后）：python3 scripts/postbuild-standalone.py _site
"""
import glob
import html
import json
import os
import re
import sys

site_dir = sys.argv[1] if len(sys.argv) > 1 else "_site"
meta_path = os.path.join(site_dir, "standalone-meta.json")
with open(meta_path, encoding="utf-8") as f:
    meta = json.load(f)
os.remove(meta_path)  # 只给脚本用，不发布

base = (meta.get("baseurl") or "").rstrip("/")
site_url = (meta.get("url") or "").rstrip("/") + base
esc = lambda s: html.escape(s, quote=True)
changed = 0

for path in sorted(glob.glob(os.path.join(site_dir, "files", "**", "*.html"), recursive=True)):
    rel = "/" + os.path.relpath(path, site_dir).replace(os.sep, "/")
    with open(path, encoding="utf-8") as f:
        page = f.read()
    m_head = re.search(r"</head\s*>", page, re.I)
    if not m_head:
        continue
    head = page[: m_head.start()]
    add = []

    title_m = re.search(r"<title[^>]*>(.*?)</title>", head, re.I | re.S)
    title = html.unescape(title_m.group(1).strip()) if title_m else os.path.basename(path)
    desc_m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']*)["\']', head, re.I)
    desc = html.unescape(desc_m.group(1)) if desc_m else meta["descriptions"].get(rel, "")
    url = site_url + rel
    image = site_url + meta["og_image"]

    def missing(pattern):
        return re.search(pattern, head, re.I) is None

    if desc and not desc_m:
        add.append(f'<meta name="description" content="{esc(desc)}">')
    if missing(r'name=["\']author["\']'):
        add.append(f'<meta name="author" content="{esc(meta["author"])}">')
    if missing(r'rel=["\']canonical["\']'):
        add.append(f'<link rel="canonical" href="{url}">')
    if missing(r'property=["\']og:title["\']'):
        add += [
            '<meta property="og:type" content="article">',
            f'<meta property="og:site_name" content="{esc(meta["author"])}">',
            f'<meta property="og:title" content="{esc(title)}">',
            f'<meta property="og:url" content="{url}">',
            f'<meta property="og:image" content="{image}">',
            '<meta property="og:image:width" content="1200">',
            '<meta property="og:image:height" content="630">',
            '<meta property="og:locale" content="zh_CN">',
        ]
        if desc:
            add.append(f'<meta property="og:description" content="{esc(desc)}">')
    if missing(r'name=["\']twitter:card["\']'):
        add.append('<meta name="twitter:card" content="summary_large_image">')
    if missing(r'itemprop=["\']name["\']'):
        add += [
            f'<meta itemprop="name" content="{esc(title)}">',
            f'<meta itemprop="image" content="{image}">',
        ]
        if desc:
            add.append(f'<meta itemprop="description" content="{esc(desc)}">')
    if meta.get("baidu_analytics") and "hm.baidu.com/hm.js" not in page and "/assets/js/analytics.js" not in page:
        add.append(f'<script src="{base}/assets/js/analytics.js" defer></script>')

    if add:
        block = "<!-- 以下由部署脚本 scripts/postbuild-standalone.py 自动补充 -->\n" + "\n".join(add) + "\n"
        page = page[: m_head.start()] + block + page[m_head.start():]
        with open(path, "w", encoding="utf-8") as f:
            f.write(page)
        changed += 1
        print(f"补充 {rel}：{len(add)} 项")

print(f"独立页面处理完成，共补充 {changed} 个页面。")
