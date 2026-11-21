---
permalink: /
title: "关于我"
# 以下是给搜索引擎看的：页面正文里仍显示“关于我”，搜索结果里显示下面这两行
seo_title: "郭猛（Meng Guo）· 育种经理，猪遗传育种"
description: "郭猛（Meng Guo），广西扬翔集团育种经理，从事猪遗传育种与基因组选择。发表国内核心期刊论文、发明专利多项；开源 mintyr、tidypptsda 等 R 包与种猪测定站监控工具。"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<blockquote class="motto"><p>“我相信好的研究应该能被别人重复，也应该对现实有用。”</p></blockquote>

你好，我是**郭猛**。过去 7 年，我一直在广西扬翔一线深耕种猪性能测定、遗传评估与基因组选择落地。相比停留在纸面的分析脚本，我更倾向于把生产中反复踩过的坑，打磨成同行能直接上手的 **R 包、桌面/交互软件与实战教程**。更多工具和资料见[项目]({{ base_path }}/portfolio/)，研究详情见[成果]({{ base_path }}/publications/)。

{% include home-showcase.html %}

## 研究方向

- 遗传评估与基因组选择在种猪选留中的应用
- 种猪测定站监控与数据分析流程建设
- 育种工具开发
- 将 AI 工具融入日常育种流程

## 经历

<!-- 经历在 _data/experience.yml 中编辑；教育和工作合在一起，按开始时间自动排序，最新的在最上面 -->
{% assign all_exp = "" | split: "" %}
{% if site.data.experience.education %}{% assign all_exp = all_exp | concat: site.data.experience.education %}{% endif %}
{% if site.data.experience.work %}{% assign all_exp = all_exp | concat: site.data.experience.work %}{% endif %}
{% assign all_exp = all_exp | sort: "time" | reverse %}
<ul class="plain-list">
{% for e in all_exp %}
  <li><span class="when">{{ e.time }}</span><span class="what">{{ e.what }}，{{ e.where }}{% if e.note %}<span class="sub">{{ e.note }}</span>{% endif %}</span></li>
{% endfor %}
</ul>

## 联系

遇到下面这些情况，欢迎直接来信，我通常在两三天内回复：

- **工具问题**：用 R 包或桌面软件遇到报错、想加新功能（也可以在 GitHub 提 Issue）
- **同行交流**：基因组选择、测定站数据质控、遗传评估中的经验和难题
- **分享与合作**：测定站数据分析或 R 语言培训、讲座邀请、开源共建

<p class="contact-line">邮箱 <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a> · <a href="https://github.com/{{ site.author.github }}">GitHub</a></p>
