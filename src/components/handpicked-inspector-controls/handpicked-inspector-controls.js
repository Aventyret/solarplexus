const { __ } = window.wp.i18n;

import { findIndex } from 'lodash';

import {
	PanelBody,
	Card,
	CardBody,
	Button,
	RangeControl,
	CheckboxControl,
} from '@wordpress/components';

import { isArray } from 'lodash';

import { InspectorControls } from '@wordpress/block-editor';
import SearchPostControl from '../common-controls/search-post-control';
import CustomControls from '../custom-controls/custom-controls';

const HandpickedInspectorControls = ({ attributes, setAttributes, config }) => {
	const selectSearchResult = (searchResult) => {
		const searchResults = config.prependNewPosts
			? [searchResult, ...attributes.searchResults]
			: [...attributes.searchResults, searchResult];
		setAttributes({
			searchResults,
		});
	};
	const move = (itemId, isUp) => {
		const itemIndex = findIndex(attributes.searchResults, (searchResult) => {
			return searchResult.id === itemId;
		});
		if (itemIndex === -1 || (isUp && itemIndex === 0)) return;

		const items = [...attributes.searchResults];

		if (!isUp && itemIndex === items.length - 1) return;

		const newArr = items;
		const newIndex = isUp ? itemIndex - 1 : itemIndex + 1;
		const firstItem = items[itemIndex];
		newArr[itemIndex] = items[newIndex];
		newArr[newIndex] = firstItem;

		setAttributes({
			searchResults: newArr,
		});
	};
	const moveSearchResultUp = (searchResultId) => {
		move(searchResultId, true);
	};
	const moveSearchResultDown = (searchResultId) => {
		move(searchResultId, false);
	};
	const removeSearchResult = (searchResultId) => {
		setAttributes({
			searchResults: attributes.searchResults.filter((searchResult) => {
				return searchResult.id !== searchResultId;
			}),
		});
	};
	const onNoOfPostsChange = (value) => {
		setAttributes({ noOfPosts: value });
	};
	const onHideDuplicatesCheckboxChange = () => {
		setAttributes({ hideDuplicates: !attributes.hideDuplicates });
	};

	return (
		<InspectorControls>
			<PanelBody title={__('Posts', 'splx')}>
				<SearchPostControl
					attributes={attributes}
					config={config}
					selectSearchResult={selectSearchResult}
					existingPosts={attributes.searchResults}
				/>
				{attributes.searchResults.length ? (
					<div className="splx-handpickedPostsWrap">
						<h4>{__('Selected posts', 'splx')}</h4>
						<div className="splx-handpickedPosts">
							{attributes.searchResults.map((searchResult) => {
								return (
									<Card key={searchResult.id}>
										<CardBody>
											<h5 className="splx-handpickedPostTitle">
												{searchResult.title}
											</h5>
											<div className="splx-handpickedPostButtons">
												<Button
													isSecondary
													isSmall
													onClick={() => moveSearchResultUp(searchResult.id)}
												>
													{__('Move up', 'splx')}
												</Button>
												<Button
													isSecondary
													isSmall
													onClick={() => moveSearchResultDown(searchResult.id)}
												>
													{__('Move down', 'splx')}
												</Button>
												<Button
													isSecondary
													isSmall
													onClick={() => removeSearchResult(searchResult.id)}
												>
													{__('Remove', 'splx')}
												</Button>
											</div>
										</CardBody>
									</Card>
								);
							})}
						</div>
					</div>
				) : null}
			</PanelBody>
			<PanelBody title={__('Block settings', 'splx')}>
				{isArray(config.noOfPosts) ? (
					<RangeControl
						value={attributes.noOfPosts}
						label={__('Number of items', 'splx')}
						min={config.noOfPosts[0]}
						max={config.noOfPosts[1]}
						onChange={(value) => onNoOfPostsChange(value)}
					/>
				) : null}
				<CheckboxControl
					checked={attributes.hideDuplicates}
					label={__('Hide duplicates', 'splx')}
					help={__(
						'This will hide posts that are shown in blocks earlier on the page (they will still be visible in the editor).',
						'splx'
					)}
					onChange={onHideDuplicatesCheckboxChange}
				/>
			</PanelBody>
			<CustomControls
				attributes={attributes}
				setAttributes={setAttributes}
				config={config}
			/>
		</InspectorControls>
	);
};

export default HandpickedInspectorControls;
