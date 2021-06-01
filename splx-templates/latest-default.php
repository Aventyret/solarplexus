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

<?php if ($args['posts']) : ?>
	<div class="splx-wrap splx-wrap--ssr">
		<div class="splx-grid <?php echo esc_attr($args['classes_grid']); ?>">
			<?php foreach ($args['posts'] as $post) : setup_postdata($post); ?>
				<div class="splx-gridItemPost <?php echo esc_attr($args['classes_item']); ?> <?php echo has_post_thumbnail() ? 'splx-gridItemPost--hasImg' : ''; ?>">
					<?php if (has_post_thumbnail()) : ?>
						<div class="splx-gridItemPost__image">
							<div class="splx-gridItemPostFeaturedMedia">
								<?php the_post_thumbnail('large'); ?>
							</div>
						</div>
					<?php endif; ?>

					<div class="splx-gridItemPost__content">
						<h3 class="splx-gridItemPost__heading">
							<a href="<?php the_permalink(); ?>" class="splx-gridItemPost__heading__link" title="<?php the_title_attribute(); ?>">
								<?php the_title(); ?>
							</a>
						</h3>

						<?php if (array_key_exists('showExcerpt', $args['config'])) : ?>
							<div class="splx-gridItemPost__excerpt">
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>

						<?php if (array_key_exists('showDate', $args['config'])) : ?>
							<div class="splx-gridItemPost__date">
								<?php the_date(); ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php wp_reset_postdata(); endif; ?>
