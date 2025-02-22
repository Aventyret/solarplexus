import SearchPostControl from '../common-controls/search-post-control';
import CustomControls from '../custom-controls/custom-controls';
import SchedulingControls from '../common-controls/scheduling-controls';

const { InspectorControls } = window.wp.blockEditor;
const { __ } = window.wp.i18n;
const { PanelBody, Card, CardBody, Button, Icon, CheckboxControl } =
	window.wp.components;

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
		const itemIndex = attributes.searchResults.findIndex((searchResult) => {
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
	const onRandomizeCheckboxChange = () => {
		setAttributes({ randomize: !attributes.randomize });
	};

	return (
		<InspectorControls>
			<PanelBody title={__('Block posts', 'solarplexus')}>
				<SearchPostControl
					attributes={attributes}
					config={config}
					selectSearchResult={selectSearchResult}
					existingPosts={attributes.searchResults}
				/>
				<div className="splx-handpickedPostsWrap">
					<h4>{__('Selected posts', 'solarplexus')}</h4>
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
												label={__('Move up', 'solarplexus')}
												onClick={() => moveSearchResultUp(searchResult.id)}
											>
												<Icon icon="arrow-up-alt2" />
											</Button>
											<Button
												isSecondary
												isSmall
												label={__('Move down', 'solarplexus')}
												onClick={() => moveSearchResultDown(searchResult.id)}
											>
												<Icon icon="arrow-down-alt2" />
											</Button>
											<Button
												isSecondary
												isSmall
												label={__('Remove', 'solarplexus')}
												onClick={() => removeSearchResult(searchResult.id)}
											>
												<Icon icon="trash" />
											</Button>
										</div>
									</CardBody>
									<CardBody>
										<div className="splx-handpickedPostCustomControls">
											<CustomControls
												attributes={attributes}
												setAttributes={setAttributes}
												config={config}
												searchResult={searchResult}
												isPostCustomControls={true}
											/>
										</div>
									</CardBody>
								</Card>
							);
						})}
					</div>
				</div>
			</PanelBody>
			<PanelBody title={__('Block settings', 'solarplexus')}>
				<CustomControls
					attributes={attributes}
					setAttributes={setAttributes}
					config={config}
				/>
				<CheckboxControl
					checked={attributes.hideDuplicates}
					label={__('Hide duplicates', 'solarplexus')}
					help={__(
						'This will hide posts that are shown in blocks earlier on the page (they will still be visible in the editor).',
						'solarplexus'
					)}
					onChange={onHideDuplicatesCheckboxChange}
				/>
				{config.allowRandomize ? (
					<CheckboxControl
						checked={attributes.randomize}
						label={__('Randomize the posts', 'solarplexus')}
						onChange={onRandomizeCheckboxChange}
					/>
				) : null}
				{config.allowScheduling ? (
					<SchedulingControls
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				) : null}
			</PanelBody>
		</InspectorControls>
	);
};

export default HandpickedInspectorControls;
