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

if (!defined('ABSPATH')) {
	exit();
}
// Exit if accessed directly
?>
<?php if ($args['posts']): ?>
	<div class="splx-wrap splx-wrap--ssr">
		<ul class="wp-block-latest-posts__list hasdates wp-block-latest-posts">
			<?php foreach ($args['posts'] as $post):
   	setup_postdata($post); ?>
				<li>
					<?php if (has_post_thumbnail()): ?>
						<div class="wp-block-latest-posts__featured-image">
							<?php the_post_thumbnail('large'); ?>
						</div>
					<?php endif; ?>

					<a href="<?php the_permalink(); ?>" class="wp-block-latest-posts__post-title" title="<?php the_title_attribute(); ?>">
						<?php the_title(); ?>
					</a>

					<?php if (array_key_exists('showDate', $args['config'])): ?>
						<time datetime="<?php echo the_date(
      	'c'
      ); ?>" class="wp-block-latest-posts__post-date">
							<?php the_date(); ?>
						</time>
					<?php endif; ?>

					<?php if (array_key_exists('showExcerpt', $args['config'])): ?>
						<div class="wp-block-latest-posts__post-excerpt">
							<?php the_excerpt(); ?>
						</div>
					<?php endif; ?>
				</li>
			<?php
   endforeach; ?>
		</ul>
		<?php if ($args['pagination']):
  	Solarplexus::the_block_pagination($args);
  endif; ?>
	</div>
<?php wp_reset_postdata();endif; ?>
