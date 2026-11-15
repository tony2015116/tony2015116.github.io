---
permalink: /
title: "关于我"
# 以下是给搜索引擎看的：页面正文里仍显示“关于我”，搜索结果里显示下面这两行
seo_title: "郭猛（Meng Guo）· 育种经理，猪遗传育种"
description: "郭猛（Meng Guo），广西扬翔农牧育种经理，从事猪遗传育种与基因组选择。发表国内核心期刊论文、发明专利多项；开源 mintyr、tidypptsda 等 R 包与种猪测定站监控工具。"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

我叫郭猛，现任广西扬翔育种经理。

我主要从事种猪选留、性能测定和遗传评估，也负责推进核心育种场和试验场的育种工作。我在种猪性能测定站管理和数据分析方面积累了多年经验。

工作中反复用到的数据清洗和分析方法，我陆续整理成了 R 包、桌面软件、教程和速查表。相关代码已在 GitHub 公开，工具和资料汇总在[项目]({{ base_path }}/portfolio/)中。围绕实际育种问题开展的研究，可在[研究成果]({{ base_path }}/publications/)中查看。

如果你也关注这些问题，或者只是想聊聊，欢迎联系我。

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

邮箱：<a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>

我通常会在两三天内回复。
