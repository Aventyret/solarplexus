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
<?php if ($args['posts']):
	$columns = min(count($args['posts']), 3); ?>
<div class="has-global-padding is-layout-constrained wp-block-query alignwide">
	<ul class="is-layout-flow is-flex-container columns-<?php echo esc_attr($columns); ?> alignwide splx-wp-block-post-template">
		<?php foreach ($args['posts'] as $post):
  	setup_postdata($post); ?>
		<li class="wp-block-post post-<?php the_ID(); ?> post type-<?php echo esc_attr(get_post_type()); ?> status-publish<?php if (
 	has_post_thumbnail()
 ): ?> has-post-thumbnail<?php endif; ?>">
			<figure style="width:100%;" class="alignwide wp-block-post-featured-image"><a href="<?php the_permalink(); ?>" target="_self"><?php the_post_thumbnail(
	'large'
); ?></a></figure>
			<h2 class="wp-block-post-title"><a href="<?php the_permalink(); ?>" target="_self"><?php the_title(); ?></a></h2>
			<?php if (
   	array_key_exists('showExcerpt', $args['config'])
   ): ?><p class="wp-block-post-excerpt"><?php the_excerpt(); ?></p><?php endif; ?>
			<?php if (
   	array_key_exists('showDate', $args['config'])
   ): ?><div class="wp-block-post-date"><time datetime="<?php the_date(
	'c'
); ?>"><a href="<?php the_permalink(); ?>"><?php echo get_the_date(); ?></a></time></div><?php endif; ?>
			<div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
		</li>
		<?php
  endforeach; ?>
	</ul>
	<?php if ($args['pagination']):
 	Solarplexus::the_block_pagination(
 		array_merge($args, [
 			'class' =>
 				'is-content-justification-space-between is-layout-flex wp-container-6 alignwide wp-block-query-pagination',
 			'next_text' => 'Next Posts',
 			'prev_text' => 'Previous Posts',
 		])
 	);
 endif; ?>
</div>
<?php wp_reset_postdata();
endif; ?>
