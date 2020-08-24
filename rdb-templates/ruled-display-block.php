<?php
/**
 * Available arguments
 *
 * $args['posts']
 * $args['block_attributes']
 *
 */
?>

<?php if ($args['posts']) : ?>
	<ul class="rdb-block">
		<?php foreach ($args['posts'] as $post) : setup_postdata($post); ?>
			<li>
				<?php if (has_post_thumbnail()) : ?>
					<figure class="rdb-block__thumbnail">
						<?php the_post_thumbnail('medium'); ?>
					</figure>
				<?php endif; ?>

				<a href="<?php echo esc_url(get_permalink()); ?>" class="rdb-block__title">
					<?php the_title(); ?>
				</a>

				<div class="rdb-block__excerpt">
					<?php the_excerpt(); ?>
				</div>
			</li>
		<?php endforeach; ?>
	</ul>
<?php wp_reset_postdata(); endif; ?>