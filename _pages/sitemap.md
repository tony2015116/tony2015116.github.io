---
layout: archive
title: "网站地图"
permalink: /sitemap/
author_profile: true
---

{% include base_path %}

本站所有页面与文章的列表。搜索引擎可使用 [XML 版本]({{ base_path }}/sitemap.xml)。

<h2>页面</h2>
{% for post in site.pages %}
  {% include archive-single.html %}
{% endfor %}


{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
{% unless collection.output == false or collection.label == "posts" %}
  {% capture label %}{{ collection.label }}{% endcapture %}
  {% if label != written_label %}
  {% case label %}{% when "publications" %}{% assign label = "研究成果" %}{% when "portfolio" %}{% assign label = "项目" %}{% endcase %}
  <h2>{{ label }}</h2>
  {% capture written_label %}{{ label }}{% endcapture %}
  {% endif %}
{% endunless %}
{% for post in collection.docs %}
  {% unless collection.output == false or collection.label == "posts" %}
  {% include archive-single.html %}
  {% endunless %}
{% endfor %}
{% endfor %}
