<?php
/*
Plugin Name: Folding Archive Widget
Plugin URI: http://github.com/jcottrell/folding-archive-widget
Description: Display archive by year with month folded under it and all posts for that month folded under the month.
Version: 0.2.2
Author: Joshua Cottrell
Author URI: http://github.com/jcottrell
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/


class Folding_Archive_Widget extends WP_Widget {
	public function __construct() {
		parent::__construct(
			'folding_archive_widget',
			'Folding Archive Widget',
			array( 'description' => __( 'Year, month, posts folding archives', 'faw_cjh_domain' ) )
		);
		add_action( 'wp_enqueue_scripts', array( &$this, 'add_styles' ) );
		add_action( 'wp_enqueue_scripts', array( &$this, 'add_script' ) );
	}

	public function form( $instance ) {
		if ( isset( $instance[ 'title' ] ) ) {
			$title = $instance[ 'title' ];
		} else {
			$title = __( 'New title', 'faw_cjh_domain' );
		}
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
		</p>
	<?php
	}

	public function update( $new_instance, $old_instance ) {
		$instance = is_array( $old_instance ) ? $old_instance : array();
		$instance['title'] = strip_tags( $new_instance['title'] );

		return $instance;
	}

	public function widget( $args, $instance ) {
		global $wpdb, $post;
		$save_post = $post;
		extract( $args );
		$title = apply_filters( 'widget_title', $instance['title'] );

		$all_posts = $wpdb->get_results( "SELECT ID, post_title, post_date"
			. " FROM $wpdb->posts"
			. " WHERE $wpdb->posts.post_status = 'publish' AND $wpdb->posts.post_type = 'post'"
			. " ORDER BY post_date DESC" );

		$list_array = array();
		foreach( $all_posts as $post ) {
			$post_year = substr( $post->post_date, 0, 4 );
			$post_month = substr( $post->post_date, 5, 2 );
			if (! isset( $list_array[$post_year] ) ) {
				$list_array[$post_year] = array();
			}
			if (! isset( $list_array[$post_year][$post_month] ) ) {
				$list_array[$post_year][$post_month] = array();
			}
			if (! isset( $year_count[$post_year] ) ) {
				$year_count[$post_year] = 0;
			}
			$year_count[$post_year] += 1;
			$list_array[$post_year][$post_month][] = array( 'ID' => $post->ID, 'title' => $post->post_title, 'date' => substr( $post->post_date, 0, 8 ) );
		}

		echo $before_widget;
		if ( ! empty( $title ) ) {
			echo $before_title . $title . $after_title;
		}

		echo '<ul class="fawjc-year-wrap">';
		foreach ( $list_array as $year => $year_array ) {
			echo '<li class="fawjc-year fawjc-y-' . $year . '"><span class="fawjc-sel fawjc-sel-y">&nbsp;' . $year . '&nbsp;(' . $year_count[$year] . ')</span><ul class="fawjc-month-wrap">' . "\n";
			foreach ( $year_array as $month => $month_array ) {
				echo '<li class="fawjc-month fawjc-m-' . $month . '"><span class="fawjc-sel fawjc-sel-m">&nbsp;' . date( 'F', strtotime( $year . $month . '01' ) ) . "&nbsp;(" . count( $month_array ) . ')</span><ul class="fawjc-post-wrap">' . "\n";
				foreach ( $month_array as $post ) {
					$current_post = '';
					if ( is_single() && ( (int) $post['ID'] === $save_post->ID ) ) {
						$current_post = 'fawjc-post-current';
					}
					echo '<li class="fawjc-post' . ( strlen( $current_post ) > 0 ? ' ' . $current_post : '' ) . '"><a href="' . apply_filters( 'the_permalink', get_permalink( $post['ID'] ) ) . '">' . $post['title'] . "</a></li>\n";
				}
				echo "</ul></li>\n";
			}
			echo "</ul></li>\n";
		}
		echo "</ul>\n";

		echo $after_widget;
		$post = $save_post;
	}

	function add_styles() {
		wp_enqueue_style( 'fawjc-styles', plugins_url( 'folding-archive-widget.css', __FILE__ ) );
	}

	function add_script() {
		wp_enqueue_script( 'fawjc-script', plugins_url( 'folding-archive-widget-v0.2.2.js', __FILE__ ), array(), '', true );
	}
}
add_action( 'widgets_init', create_function( '', 'register_widget( "Folding_Archive_Widget" );' ) );
