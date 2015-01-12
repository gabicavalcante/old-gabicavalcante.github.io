---
layout: page
title: Posts
---

{% for post in site.posts %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
{% endfor %}

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
  {% capture this_word %}{{ tags_list[item] | strip_newlines }}{% endcapture %}
	<article>
	<h2 id="{{ this_word }}" class="tag-heading">{{ this_word }}</h2>
		<ul>
		    {% for post in site.tags[this_word] %}
		    	{% if post.title != null %}
		      		<li class="entry-title">
		      			<a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a>
		      		</li>
		    	{% endif %}
		    {% endfor %}
		</ul>
	</article> 
{% endunless %}{% endfor %}