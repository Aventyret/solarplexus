import{_ as e,c as t,o,a}from"./app.a34a8c50.js";var l="/solarplexus/solarplexus.svg",i="/solarplexus/article.svg",n="/solarplexus/articles.svg",s="/solarplexus/masonry.svg",d="/solarplexus/1-col.svg",r="/solarplexus/2-col.svg",u="/solarplexus/3-col.svg",c="/solarplexus/4-col.svg",p="/solarplexus/2-grid.svg",h="/solarplexus/3-grid.svg",m="/solarplexus/4-grid.svg";const P='{"title":"Configuration","description":"","frontmatter":{},"headers":[{"level":2,"title":"Configuration reference","slug":"configuration-reference"},{"level":3,"title":"id","slug":"id"},{"level":3,"title":"title","slug":"title"},{"level":3,"title":"type","slug":"type"},{"level":3,"title":"allowedPostTypes","slug":"allowedposttypes"},{"level":3,"title":"noOfPosts","slug":"noofposts"},{"level":3,"title":"allowScheduling - optional","slug":"allowscheduling-optional"},{"level":3,"title":"prependNewPosts","slug":"prependnewposts"},{"level":3,"title":"allowedTaxonomies","slug":"allowedtaxonomies"},{"level":3,"title":"allowedPostStatuses - optional","slug":"allowedpoststatuses-optional"},{"level":3,"title":"randomize - optional","slug":"randomize-optional"},{"level":3,"title":"allowRandomize - optional","slug":"allowrandomize-optional"},{"level":3,"title":"allowDuplicates - optional","slug":"allowduplicates-optional"},{"level":3,"title":"allowPagination - optional","slug":"allowpagination-optional"},{"level":3,"title":"allowOffset - optional","slug":"allowoffset-optional"},{"level":3,"title":"allowHandpicked - optional","slug":"allowhandpicked-optional"},{"level":3,"title":"allowHandpicked - optional","slug":"allowhandpicked-optional-1"},{"level":3,"title":"handpickedPostTypes - optional","slug":"handpickedposttypes-optional"},{"level":3,"title":"icon - optional","slug":"icon-optional"},{"level":3,"title":"customControls - optional","slug":"customcontrols-optional"},{"level":3,"title":"postCustomControls - optional","slug":"postcustomcontrols-optional"},{"level":2,"title":"Configuration attributes for default templates","slug":"configuration-attributes-for-default-templates"},{"level":3,"title":"noOfGridCols","slug":"noofgridcols"},{"level":3,"title":"itemLayout","slug":"itemlayout"},{"level":3,"title":"showDate","slug":"showdate"},{"level":3,"title":"showExcerpt","slug":"showexcerpt"},{"level":2,"title":"Adjust configuration with php filter","slug":"adjust-configuration-with-php-filter"}],"relativePath":"guide/config.md"}',f={},g=a(`<h1 id="configuration" tabindex="-1">Configuration <a class="header-anchor" href="#configuration" aria-hidden="true">#</a></h1><p>To define your own blocks instead of the two default ones, the first thing you need to do is to create a config file in your theme.</p><p>In the root of your theme, create the file <code>splx-config.json</code>. If you are using <strong>Roots Sage</strong>, create the file in the <code>resources</code> folder. <strong>When a custom config is created in your theme, the two default blocks will not be available anymore</strong>.</p><p>Here&#39;s an example config, which defines two blocks similar to the blocks that the plugin ships with by default (that are described on the previous page):</p><div class="language-"><pre><code>[
  {
    &quot;id&quot;: &quot;my-example-dynamic&quot;,
    &quot;title&quot;: &quot;My dynamic posts or pages example&quot;,
    &quot;type&quot;: &quot;dynamic&quot;,
    &quot;allowedPostTypes&quot;: [&quot;post&quot;, &quot;page&quot;],
    &quot;allowedTaxonomies&quot;: [&quot;category&quot;],
    &quot;noOfPosts&quot;: [2,8],
    &quot;noOfGridCols&quot;: 2,
    &quot;itemLayout&quot;: &quot;imagebg&quot;,
    &quot;showDate&quot;: true,
    &quot;showExcerpt&quot;: true,
    &quot;customControls&quot;: []
  },
  {
    &quot;id&quot;: &quot;my-example-handpicked&quot;,
    &quot;title&quot;: &quot;My hand picked posts or pages example&quot;,
    &quot;type&quot;: &quot;handpicked&quot;,
    &quot;allowedPostTypes&quot;: [&quot;post&quot;, &quot;page&quot;],
    &quot;noOfPosts&quot;: 8,
    &quot;prependNewPosts&quot;: true,
    &quot;noOfGridCols&quot;: 2,
    &quot;itemLayout&quot;: &quot;imagebg&quot;,
    &quot;showDate&quot;: true,
    &quot;showExcerpt&quot;: true,
    &quot;customControls&quot;: [],
    &quot;postCustomControls&quot;: []
  }
]

</code></pre></div><p>You can create as many block types as you need by adding objects to the array. All options are <em>required</em>, if nothing else is stated in the reference below.</p><h2 id="configuration-reference" tabindex="-1">Configuration reference <a class="header-anchor" href="#configuration-reference" aria-hidden="true">#</a></h2><h3 id="id" tabindex="-1">id <a class="header-anchor" href="#id" aria-hidden="true">#</a></h3><p><em>string</em> - A unique ID without spaces to identify your block type in the database.</p><h3 id="title" tabindex="-1">title <a class="header-anchor" href="#title" aria-hidden="true">#</a></h3><p><em>string</em> - The title of the block type.</p><h3 id="type" tabindex="-1">type <a class="header-anchor" href="#type" aria-hidden="true">#</a></h3><p><em>string</em> - There are two types of block types - <code>dynamic</code> and <code>handpicked</code>. Dynamic loads the latest posts based on the configuration combined with the editors choices, while Hand picked always shows the same posts that the editor specifically has picked.</p><h3 id="allowedposttypes" tabindex="-1">allowedPostTypes <a class="header-anchor" href="#allowedposttypes" aria-hidden="true">#</a></h3><p><em>[string]</em> - The post type(s) the editor will be able to choose from when using the block. For custom post types, you must have <code>show_in_rest</code> set to <code>true</code> when calling <code>register_post_type</code> in your theme/plugin.</p><p>If you omit <code>allowedPostTypes</code> dynamic blocks will show <code>posts</code> and handpicked blocks will be able to show any post type.</p><h3 id="noofposts" tabindex="-1">noOfPosts <a class="header-anchor" href="#noofposts" aria-hidden="true">#</a></h3><p><em>int|[int]</em> - The maximum posts to be shown in the resulting lists. An array can be used, with 2 positions declaring the min and max number, e.g [3, 6], letting the editor choose from a range between these.</p><h3 id="allowscheduling-optional" tabindex="-1">allowScheduling - optional <a class="header-anchor" href="#allowscheduling-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - If true the block will have date pickers for Publish at and Unpublish at. Defaults to <code>false</code>.</p><h3 id="prependnewposts" tabindex="-1">prependNewPosts <a class="header-anchor" href="#prependnewposts" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>handpicked</code> type only. If true posts are added to the start of the list, otherwise they are appended at the end. Defaults to <code>false</code>.</p><h3 id="allowedtaxonomies" tabindex="-1">allowedTaxonomies <a class="header-anchor" href="#allowedtaxonomies" aria-hidden="true">#</a></h3><p><em>[string]</em> - <code>dynamic</code> type only. The key(s) of the taxonomies the editor will be able to filter on when using the block. For custom taxonomies, you must have <code>show_in_rest</code> set to <code>true</code> when calling <code>register_taxonomy</code> in your theme/plugin.</p><h3 id="allowedpoststatuses-optional" tabindex="-1">allowedPostStatuses - optional <a class="header-anchor" href="#allowedpoststatuses-optional" aria-hidden="true">#</a></h3><p><em>[string]</em> - <code>handpicked</code> type only. Defaults to [&quot;publish&quot;]. Posts with any other status than &quot;publish&quot; will only be visible in the editor.</p><h3 id="randomize-optional" tabindex="-1">randomize - optional <a class="header-anchor" href="#randomize-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>handpicked</code> type only. If true the order of the posts will be shuffled. If more posts are selected than the max <code>noOfPosts</code> the posts array will (as always) also be capped to <code>noOfPosts</code>. Defaults to <code>false</code>.</p><h3 id="allowrandomize-optional" tabindex="-1">allowRandomize - optional <a class="header-anchor" href="#allowrandomize-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>handpicked</code> type only. If true the block will have a checkbox to control if posts are randomized (see <code>randomize</code>). Defaults to <code>false</code>.</p><h3 id="allowduplicates-optional" tabindex="-1">allowDuplicates - optional <a class="header-anchor" href="#allowduplicates-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>dynamic</code> type only. Sets if Solarplexus check for not showing duplicate posts on the same page should be disabled. Defaults to <code>false</code>.</p><h3 id="allowpagination-optional" tabindex="-1">allowPagination - optional <a class="header-anchor" href="#allowpagination-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>dynamic</code> type only. Sets if editors should be allowed to enable pagination for blocks of this type. Defaults to <code>false</code>.</p><h3 id="allowoffset-optional" tabindex="-1">allowOffset - optional <a class="header-anchor" href="#allowoffset-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>dynamic</code> type only. Sets if editors should be allowed to enable offset for blocks of this type. Defaults to <code>false</code>.</p><h3 id="allowhandpicked-optional" tabindex="-1">allowHandpicked - optional <a class="header-anchor" href="#allowhandpicked-optional" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>dynamic</code> type only. Sets if editors should be allowed to add handpicked posts to dynamic blocks. Defaults to <code>false</code>.</p><h3 id="allowhandpicked-optional-1" tabindex="-1">allowHandpicked - optional <a class="header-anchor" href="#allowhandpicked-optional-1" aria-hidden="true">#</a></h3><p><em>boolean</em> - <code>dynamic</code> type only. Sets if editors should be allowed to add handpicked posts to dynamic blocks. Defaults to <code>false</code>.</p><h3 id="handpickedposttypes-optional" tabindex="-1">handpickedPostTypes - optional <a class="header-anchor" href="#handpickedposttypes-optional" aria-hidden="true">#</a></h3><p><em>[string]</em> - Specifies of what post types posts can be handpicked from. If omitted <code>allowedPostTypes</code> will be used.</p><h3 id="icon-optional" tabindex="-1">icon - optional <a class="header-anchor" href="#icon-optional" aria-hidden="true">#</a></h3><p><em>string</em> - The icon for the block type, defaults to the Solarplexus logo. Use one of the following default logos or an inline SVG html string. Double quotes can be escaped.</p><table><thead><tr><th>Name</th><th>Icon</th></tr></thead><tbody><tr><td>default</td><td><img src="`+l+'" alt=""></td></tr><tr><td>article</td><td><img src="'+i+'" alt=""></td></tr><tr><td>articles</td><td><img src="'+n+'" alt=""></td></tr><tr><td>masonry</td><td><img src="'+s+'" alt=""></td></tr><tr><td>1-col</td><td><img src="'+d+'" alt=""></td></tr><tr><td>2-col</td><td><img src="'+r+'" alt=""></td></tr><tr><td>3-col</td><td><img src="'+u+'" alt=""></td></tr><tr><td>4-col</td><td><img src="'+c+'" alt=""></td></tr><tr><td>2-col-grid</td><td><img src="'+p+'" alt=""></td></tr><tr><td>3-col-grid</td><td><img src="'+h+'" alt=""></td></tr><tr><td>4-col-grid</td><td><img src="'+m+`" alt=""></td></tr></tbody></table><h3 id="customcontrols-optional" tabindex="-1">customControls - optional <a class="header-anchor" href="#customcontrols-optional" aria-hidden="true">#</a></h3><p><em>array</em> - Here you may define additional controls for the editor, that will be included as attributes on the block. Currently, selectboxes and text inputs are supported. Say for instance that you&#39;d like to add a selection of colors to add styles to in the templates:</p><div class="language-"><pre><code>&quot;customControls&quot;: [
      {
        &quot;id&quot;: &quot;color&quot;,
        &quot;type&quot;: &quot;select&quot;,
        &quot;name&quot;: &quot;Color&quot;,
        &quot;choices&quot;: [
          {
            &quot;value&quot;: &quot;red&quot;,
            &quot;label&quot;: &quot;Red&quot;
          },
          {
            &quot;value&quot;: &quot;blue&quot;,
            &quot;label&quot;: &quot;Blue&quot;
          }
        ]
      }
    ]
</code></pre></div><p>Or, add a heading to the post list:</p><div class="language-"><pre><code>&quot;customControls&quot;: [
      {
        &quot;id&quot;: &quot;heading&quot;,
        &quot;type&quot;: &quot;text&quot;,
        &quot;name&quot;: &quot;Heading&quot;
      }
    ]
</code></pre></div><p>For longer texts, you can use the textarea type:</p><div class="language-"><pre><code>&quot;customControls&quot;: [
      {
        &quot;id&quot;: &quot;preamble&quot;,
        &quot;type&quot;: &quot;textarea&quot;,
        &quot;name&quot;: &quot;Preamble&quot;
      }
    ]
</code></pre></div><p>The id (as long as it doesn&#39;t collide with an already-exisiting attribute), name and choices can be anything you&#39;d like. See more on the next page on how to work with templates.</p><h3 id="postcustomcontrols-optional" tabindex="-1">postCustomControls - optional <a class="header-anchor" href="#postcustomcontrols-optional" aria-hidden="true">#</a></h3><p><em>array</em> - <code>handpicked</code> type only. Here you may define additional controls for each selected post in the editor, that will be included in the Post object. Currently, selectboxes and text inputs are supported. Say for instance that you&#39;d like to add a custom title instead of using post_title:</p><div class="language-"><pre><code>&quot;postCustomControls&quot;: [
      {
        &quot;id&quot;: &quot;custom_post_title&quot;,
        &quot;type&quot;: &quot;text&quot;,
        &quot;name&quot;: &quot;Set a custom post title&quot;
      }
    ]
</code></pre></div><p>The postCustomControls are saved in the Post object, example:</p><div class="language-"><pre><code>WP_Post Object =&gt;
(
  [ID] =&gt; 38
  ...
  [post_custom_controls] =&gt; Array
  (
      [custom_post_title] =&gt; Custom post title
  )
)
</code></pre></div><h2 id="configuration-attributes-for-default-templates" tabindex="-1">Configuration attributes for default templates <a class="header-anchor" href="#configuration-attributes-for-default-templates" aria-hidden="true">#</a></h2><p>The following attributes are only required (and meaningful) when you use Solarplexus&#39; default templates.</p><h3 id="noofgridcols" tabindex="-1">noOfGridCols <a class="header-anchor" href="#noofgridcols" aria-hidden="true">#</a></h3><p><em>int</em> - The number of columns (when screen width allows) the post grid will consist of.</p><h3 id="itemlayout" tabindex="-1">itemLayout <a class="header-anchor" href="#itemlayout" aria-hidden="true">#</a></h3><p><em>string</em> - Can be either <code>imagebg</code>, <code>imagetop</code> or <code>imageleft</code>. Controls the layout within each post item in the list.</p><h3 id="showdate" tabindex="-1">showDate <a class="header-anchor" href="#showdate" aria-hidden="true">#</a></h3><p><em>bool</em> - Whether to show the post dates in the rendered lists.</p><h3 id="showexcerpt" tabindex="-1">showExcerpt <a class="header-anchor" href="#showexcerpt" aria-hidden="true">#</a></h3><p><em>bool</em> - Whether to show the post excerpts in the rendered lists.</p><h2 id="adjust-configuration-with-php-filter" tabindex="-1">Adjust configuration with php filter <a class="header-anchor" href="#adjust-configuration-with-php-filter" aria-hidden="true">#</a></h2><p>Configuration in a json file can be conveniant, but in some cases you need more flexibility.</p><p>Perhaps to add translations to block names or custom controls, or to make the configuration conditional \u2013 for instance if you want different blocks in different network sites with the same theme.</p><p>In these cases you can use the filter <code>splx_config</code> to make dynamic adjustments to the configuration. This is an example of how you could add translations to your block titles:</p><div class="language-"><pre><code>add_filter(&#39;splx_config&#39;, function($splx_config) {
  return array_map(function($block_config) {
    return array_merge(
      $block_config,
      [
        &#39;title&#39; =&gt; __($block_config[&#39;title&#39;], &#39;your_text_domain&#39;),
      ],
    );
  }, $splx_config);
});
</code></pre></div>`,73),q=[g];function y(w,b,x,_,v,k){return o(),t("div",null,q)}var T=e(f,[["render",y]]);export{P as __pageData,T as default};
