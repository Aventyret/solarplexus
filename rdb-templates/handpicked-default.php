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
	<div class="rdb-wrap">
		<div class="rdb-grid <?php echo esc_attr($args['classes_grid']); ?>">
			<?php foreach ($args['posts'] as $post) : setup_postdata($post); ?>
				<div class="gridItemPostPreview rdb-gridItemPostPreview <?php echo esc_attr($args['classes_item']); ?> <?php echo has_post_thumbnail() ? 'rdb-gridItemPostPreview--hasImg' : ''; ?>">
					<?php if (has_post_thumbnail()) : ?>
						<div class="rdb-gridItemPostPreview__image">
							<div class="rdb-gridItemPostFeaturedMediaPreview">
								<?php the_post_thumbnail('large'); ?>
							</div>
						</div>
					<?php endif; ?>

					<div class="rdb-gridItemPostPreview__content">
						<h3 class="rdb-gridItemPostPreview__heading">
							<?php the_title(); ?>
						</h3>

						<?php if (array_key_exists('showExcerpt', $args['config'])) : ?>
							<div class="rdb-gridItemPostPreview__excerpt">
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>

						<?php if (array_key_exists('showDate', $args['config'])) : ?>
							<div class="rdb-gridItemPostPreview__date">
								<?php the_date(); ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php wp_reset_postdata(); endif; ?>