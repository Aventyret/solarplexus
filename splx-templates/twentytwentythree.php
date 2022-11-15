<?php
/**
 * Available arguments
 *
 * $args['posts'] Array
 * $args['block_attributes'] Array
 * $args['classes_grid'] String
 * $args['classes_item'] String
 *
 */
?>
<?php if ($args['posts']): ?>
<div class="has-global-padding is-layout-constrained wp-block-query alignwide">
	<ul class="is-layout-flow is-flex-container columns-3 alignwide wp-block-post-template">
		<?php foreach ($args['posts'] as $post):
   	setup_postdata($post); ?>
		<li class="wp-block-post post-<?php the_ID(); ?> post type-<?php echo get_post_type(); ?> status-publish<?php if(has_post_thumbnail()): ?> has-post-thumbnail<?php endif; ?>">
			<figure style="width:100%;" class="alignwide wp-block-post-featured-image"><a href="<?php the_permalink(); ?>" target="_self"><?php the_post_thumbnail('large'); ?></a></figure>
			<h2 class="wp-block-post-title"><a href="<?php the_permalink(); ?>" target="_self"><?php the_title(); ?></a></h2>
			<?php if (get_the_excerpt()): ?><div class="wp-block-post-excerpt"><p class="wp-block-post-excerpt__excerpt"><?php the_excerpt() ?></p></div><?php endif; ?>
			<div class="wp-block-post-date"><time datetime="<?php the_date('c'); ?>"><a href="<?php the_permalink(); ?>"><?php echo get_the_date(); ?></a></time></div>
			<div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
		</li>
		<?php endforeach; ?>
	</ul>
	<?php if ($args['pagination']): ?>
	<nav class="is-content-justification-space-between is-layout-flex wp-container-6 alignwide wp-block-query-pagination" aria-label="Pagination">
		<?php Solarplexus::the_block_pagination($args); ?>
	</nav>
	<?php endif; ?>
</div>
<?php wp_reset_postdata();endif; ?>
