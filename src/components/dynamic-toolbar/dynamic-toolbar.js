const { __ } = window.wp.i18n;

import { BlockControls } from '@wordpress/block-editor';

import {
	ToolbarGroup,
	Dropdown,
	ToolbarButton,
	BaseControl,
	RangeControl,
} from '@wordpress/components';

import { isArray } from 'lodash';

import { settings } from '@wordpress/icons';

const DynamicToolbar = ({ attributes, setAttributes, config }) => {
	const onNoOfPostsChange = (value) => {
		setAttributes({ noOfPosts: value });
	};

	const onOffsetChange = (value) => {
		setAttributes({ offset: value });
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						contentClassName="block-library-query-toolbar__popover"
						renderToggle={({ onToggle }) => (
							<ToolbarButton
								icon={settings}
								label={__('Display settings', 'splx')}
								onClick={onToggle}
							/>
						)}
						renderContent={() => (
							<>
								{isArray(config.noOfPosts) ? (
									<BaseControl>
										<RangeControl
											label={__('Number of posts', 'splx')}
											value={attributes.noOfPosts}
											min={config.noOfPosts[0]}
											max={config.noOfPosts[1]}
											onChange={(value) => onNoOfPostsChange(value)}
										/>
									</BaseControl>
								) : null}
								{config.allowOffset ? (
									<BaseControl>
										<RangeControl
											label={__('Offset', 'splx')}
											value={attributes.offset}
											min={0}
											max={100}
											onChange={(value) => onOffsetChange(value)}
										/>
									</BaseControl>
								) : null}
							</>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export default DynamicToolbar;
