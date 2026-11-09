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

我叫郭猛，是某某大学某某学院的一名博士研究生，导师是某某教授。

我研究的问题，起点其实很朴素：……（TODO：用一两句话说清你关心的那个问题，以及它为什么重要）。读书时的一次……让我第一次意识到，这些看似抽象的数字背后，是真实的人和真实的生活。从那以后，我想做的就是让方法更可靠一点，让结论更经得起追问一点。

我相信好的研究应该能被别人重复，也应该对现实有用。所以我会尽量公开自己的代码和数据，也很愿意和同行交流各自走过的弯路。

如果你对这些问题也感兴趣，或者只是想聊聊，欢迎给我写信。

## 研究兴趣

- 研究方向一：一句话说明你具体在做什么
- 研究方向二：一句话说明你具体在做什么
- 研究方向三：一句话说明你具体在做什么

## 经历

<ul class="plain-list">
{% for e in site.data.experience.education %}
  <li><span class="when">{{ e.time }}</span><span class="what">{{ e.what }}，{{ e.where }}{% if e.note %}<span class="sub">{{ e.note }}</span>{% endif %}</span></li>
{% endfor %}
{% for e in site.data.experience.work %}
  <li><span class="when">{{ e.time }}</span><span class="what">{{ e.what }}，{{ e.where }}{% if e.note %}<span class="sub">{{ e.note }}</span>{% endif %}</span></li>
{% endfor %}
</ul>

## 联系

邮箱：<a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a>

我通常会在两三天内回复。
