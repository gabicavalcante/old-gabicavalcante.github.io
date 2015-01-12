---
layout: page
title: Posts
---

----------
{% for tag in site.tags %} 
{{ tag[0] | upcase }}
{% for post in site.posts %}
{% for t in post.tags %} 
{% if (t == tag[0]) %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
{% endif %} 
{% endfor %}
{% endfor %}
{% endfor %} 