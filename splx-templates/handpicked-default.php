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

<?php print_r($args); if ($args['posts']) : ?>
	<div class="splx-wrap">
		<div class="splx-grid <?php echo esc_attr($args['classes_grid']); ?>">
			<?php foreach ($args['posts'] as $post) : setup_postdata($post); ?>
				<div class="gridItemPostPreview splx-gridItemPostPreview <?php echo esc_attr($args['classes_item']); ?> <?php echo has_post_thumbnail() ? 'splx-gridItemPostPreview--hasImg' : ''; ?>">
					<?php if (has_post_thumbnail()) : ?>
						<div class="splx-gridItemPostPreview__image">
							<div class="splx-gridItemPostFeaturedMediaPreview">
								<?php the_post_thumbnail('large'); ?>
							</div>
						</div>
					<?php endif; ?>

					<div class="splx-gridItemPostPreview__content">
						<h3 class="splx-gridItemPostPreview__heading">
							<?php the_title(); ?>
						</h3>

<<<<<<< HEAD:splx-templates/handpicked-default.php
						<?php if ($args['config']['showExcerpt']) : ?>
							<div class="splx-gridItemPostPreview__excerpt">
=======
						<?php if (array_key_exists('showExcerpt', $args['config'])) : ?>
							<div class="rdb-gridItemPostPreview__excerpt">
>>>>>>> 05a12ee3d9a403314aa24736b5f656492afb90e2:rdb-templates/handpicked-default.php
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>

<<<<<<< HEAD:splx-templates/handpicked-default.php
						<?php if ($args['config']['showDate']) : ?>
							<div class="splx-gridItemPostPreview__date">
=======
						<?php if (array_key_exists('showDate', $args['config'])) : ?>
							<div class="rdb-gridItemPostPreview__date">
>>>>>>> 05a12ee3d9a403314aa24736b5f656492afb90e2:rdb-templates/handpicked-default.php
								<?php the_date(); ?>
							</div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
<?php wp_reset_postdata(); endif; ?>