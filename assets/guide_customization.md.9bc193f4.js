import{_ as e,c as t,o as a,a as s}from"./app.a34a8c50.js";const _='{"title":"Advanced Customization","description":"","frontmatter":{},"headers":[{"level":2,"title":"Defining your own CSS classes","slug":"defining-your-own-css-classes"},{"level":2,"title":"Adding custom fields or other data","slug":"adding-custom-fields-or-other-data"},{"level":2,"title":"Modifying the query","slug":"modifying-the-query"},{"level":2,"title":"Adjust block args","slug":"adjust-block-args"},{"level":2,"title":"Render blocks with a callback","slug":"render-blocks-with-a-callback"},{"level":2,"title":"Enable default block styling","slug":"enable-default-block-styling"}],"relativePath":"guide/customization.md"}',o={},i=s(`<h1 id="advanced-customization" tabindex="-1">Advanced Customization <a class="header-anchor" href="#advanced-customization" aria-hidden="true">#</a></h1><h2 id="defining-your-own-css-classes" tabindex="-1">Defining your own CSS classes <a class="header-anchor" href="#defining-your-own-css-classes" aria-hidden="true">#</a></h2><p>You can redefine the classnames for the grid and grid items to whatever you want. Simply use the custom hooks:</p><div class="language-"><pre><code>add_filter(&#39;splx_grid_classes&#39;, function($classes, $block_config, $block_attributes){
  // Use the default $classes, the $block_config and $block_attributes to
  // specify your own grid classes.
  return $classes;
}, 10, 3);

add_filter(&#39;splx_item_classes&#39;, function($classes, $block_config, $block_attributes){
  // Use the default $classes, the $block_config and $block_attributes to
  // specify your own item classes.
  return $classes;
}, 10, 3);
</code></pre></div><h2 id="adding-custom-fields-or-other-data" tabindex="-1">Adding custom fields or other data <a class="header-anchor" href="#adding-custom-fields-or-other-data" aria-hidden="true">#</a></h2><p>Often times, you&#39;re going to want to display some custom data in your items. Instead of querying for that data directly in the template, use the provided custom hook, which is applied on the posts after a successful query:</p><div class="language-"><pre><code>add_filter(&#39;splx_posts&#39;, function($posts, $block_config, $block_attributes, $pagination){
  $upd_posts = [];
  foreach($posts as $p) {
    $upd_post = clone $p;
    $upd_post-&gt;my_custom_field = get_post_meta($p-&gt;ID, &#39;my_custom_field&#39;, true);
    $upd_posts[] = $upd_post;
  }
  return $upd_posts;
}, 10, 4);
</code></pre></div><p>The <code>posts</code> array available in your template will now include the above additions.</p><h2 id="modifying-the-query" tabindex="-1">Modifying the query <a class="header-anchor" href="#modifying-the-query" aria-hidden="true">#</a></h2><p>If you&#39;d like greater control of what posts are actually queried from the database, you may change the arguments before they are passed to <code>WP_Query</code>. Example:</p><div class="language-"><pre><code>add_filter(&#39;splx_queryargs&#39;, function($args, $block_config, $block_attributes){
  $super_important_post_id = 1337;
  $args[&#39;post__in&#39;][] = $super_important_post_id; // always include a certain post no matter what.
  return $args;
}, 10, 3);
</code></pre></div><h2 id="adjust-block-args" tabindex="-1">Adjust block args <a class="header-anchor" href="#adjust-block-args" aria-hidden="true">#</a></h2><p>For advanced customization, there is a possibility to adjust the variables that are passed to Solarplexus block templates with a filter</p><div class="language-"><pre><code>add_filter(&#39;splx_block_args&#39;, function($args, $block_type_id){
  $args = array_merge($args, [&quot;interesting_fact&quot; =&gt; &quot;You are awesome!&quot;]); // This will pass the variable $args[&quot;interesting_fact&quot;] (or just $interesing_fact if you use Sage) to all Solarplexus block templates.
  return $args;
}, 10, 2);
</code></pre></div><h2 id="render-blocks-with-a-callback" tabindex="-1">Render blocks with a callback <a class="header-anchor" href="#render-blocks-with-a-callback" aria-hidden="true">#</a></h2><p>In some cases, such as with a Headless Wordpress setup, it can be usefull to render blocks with a callback rather than a template.</p><div class="language-"><pre><code>add_filter(&#39;splx_block_render_callback&#39;, function($template, $args, $block_type_id){
  if ($block_type_id == &quot;splx/special-block&quot;) {
    return &#39;&lt;p&gt;This was rendered with a callback.&lt;/p&gt;&#39;;
  }
  $args = array_merge($args, [&quot;interesting_fact&quot; =&gt; &quot;You are awesome!&quot;]); // This will pass the variable $args[&quot;interesting_fact&quot;] (or just $interesing_fact if you use Sage) to all Solarplexus block templates.
  return $template;
}, 10, 3);
</code></pre></div><h2 id="enable-default-block-styling" tabindex="-1">Enable default block styling <a class="header-anchor" href="#enable-default-block-styling" aria-hidden="true">#</a></h2><p>By default the block styling by the plugin is disabled if you&#39;ve added your own splx-config.json in your theme. If you&#39;d like to enable it, you can do so by adding the following to your theme&#39;s <code>functions.php</code> file:</p><div class="language-"><pre><code>add_filter(&#39;splx_enable_default_style&#39;, function() {
	return true;
});
</code></pre></div>`,20),n=[i];function l(r,d,c,u,p,h){return a(),t("div",null,n)}var f=e(o,[["render",l]]);export{_ as __pageData,f as default};
