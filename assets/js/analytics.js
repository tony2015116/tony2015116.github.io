---
# 独立 HTML 页面（教程、速查表、小工具）共用的统计脚本。
# ID 读取 _config.yml 的 baidu_analytics；留空则什么也不加载。
---
{% if site.baidu_analytics %}var _hmt = window._hmt = window._hmt || [];
(function () {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?{{ site.baidu_analytics }}";
  hm.async = true;
  document.head.appendChild(hm);
})();
{% endif %}