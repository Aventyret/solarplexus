const { __ } = window.wp.i18n;

import { findIndex } from 'lodash';

import {
	PanelBody,
	Card,
	CardBody,
	Button,
	CheckboxControl,
} from '@wordpress/components';

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
	const onHideDuplicatesCheckboxChange = () => {
		setAttributes({ hideDuplicates: !attributes.hideDuplicates });
	};

	return (
		<InspectorControls>
			<PanelBody title={__('Block posts', 'splx')}>
				<SearchPostControl
					attributes={attributes}
					config={config}
					selectSearchResult={selectSearchResult}
					existingPosts={attributes.searchResults}
				/>
				<div className="splx-handpickedPostsWrap">
					<h4>{__('Selected posts', 'splx')}</h4>
					<div className="splx-handpickedPosts">
						{attributes.searchResults.length === 0 ? (
							<em>{__('No posts selected')}</em>
						) : null}
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
			</PanelBody>
			<PanelBody title={__('Block settings', 'splx')}>
				<CustomControls
					attributes={attributes}
					setAttributes={setAttributes}
					config={config}
				/>
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
		</InspectorControls>
	);
};

export default HandpickedInspectorControls;
