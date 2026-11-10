---
permalink: /
title: "关于我"
author_profile: true
redirect_from:
  - /about/
  - /about.html
---

{% include base_path %}

<!-- TODO：下面几段是示例，请换成你自己的话。
     不需要写得很"厉害"，写清楚三件事就好：你是谁、你在做什么、为什么做。
     用平常说话的语气，像给一位素未谋面但感兴趣的同行写信。 -->

我叫郭猛，目前是广西扬翔的一名育种经理。

我研究的问题如何使用科学的方法选留优秀的种猪。

我相信好的研究应该能被别人重复，也应该对现实有用。所以我会尽量公开自己的代码和数据，也很愿意和同行交流各自走过的弯路。

工作中反复用到的数据清洗和分析方法，我陆续整理成了 R 包、桌面软件、教程和速查表，代码都公开在 GitHub 上，汇总在[项目]({{ base_path }}/portfolio/)页。

如果你对这些问题也感兴趣，或者只是想聊聊，欢迎给我写信。

## 研究兴趣

- 猪遗传育种
- 育种数据处理与分析工具开发

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
