import './search-post-control.scss';
import debounce from '../../utils/debounce';

const { __ } = window.wp.i18n;
const apiFetch = window.wp.apiFetch;
const { useEffect, useState, useRef } = window.wp.element;
const { TextControl, Button } = window.wp.components;
const { useSelect } = window.wp.data;

const SearchPostControl = ({ existingPosts, config, selectSearchResult }) => {
	const [searchInput, setSearchInput] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const inputRef = useRef(null);

	const allPostTypes = useSelect((select) => {
		const { getPostTypes } = select('core');
		const postTypes = getPostTypes({ per_page: -1 });

		return (postTypes || ['post']).reduce((allPostTypes, postType) => {
			allPostTypes[postType.slug] = postType;
			return allPostTypes;
		}, {});
	}, []);

	useEffect(() => {
		let postStatuses = ['publish'];
		if (config.allowedPostStatuses && config.allowedPostStatuses.length > 0) {
			postStatuses = config.allowedPostStatuses;
		}
		let postTypes = config.allowedPostTypes ? config.allowedPostTypes : [];
		if (config.handpickedPostTypes) {
			postTypes = config.handpickedPostTypes;
		}
		// Filter out post types that are not available
		const availablePostTypes =
			allPostTypes && config.allowedPostTypes
				? Object.keys(allPostTypes).filter((postTypeSlug) => {
						return config.allowedPostTypes.includes(postTypeSlug);
				  })
				: null;
		if (availablePostTypes) {
			postTypes = postTypes.filter((postType) => {
				return availablePostTypes.includes(postType);
			});
		}
		const searchUri = `/splx/v1/search/?s=${searchInput}&status=${postStatuses.join(
			','
		)}&post_type=${postTypes.join(',')}&per_page=30&nonce=${
			window.solarplexusNonce
		}`;
		const search = () =>
			apiFetch({ path: searchUri }).then((res) => {
				setSearchResults(res.slice(0, 10));
			});

		if (searchInput.length > 2) {
			search();
		} else {
			clearSearchResults();
		}
	}, [searchInput, allPostTypes]);

	const objectSubTypeLabel = (subTypeSlug) => {
		if (allPostTypes[subTypeSlug]?.labels?.singular_name) {
			return allPostTypes[subTypeSlug].labels.singular_name;
		}
		return subTypeSlug;
	};

	const onSearchInputChange = debounce((value) => {
		setSearchInput(value);
	});

	const clearSearchResults = () => {
		setSearchResults([]);
	};

	const onSelectSearchResult = (searchResult) => {
		setSearchInput('');
		inputRef.current.value = '';
		selectSearchResult(searchResult);
	};

	return (
		<div>
			<h4>{__('Search posts', 'solarplexus')}</h4>
			<TextControl
				ref={inputRef}
				onChange={(nextValue) => onSearchInputChange(nextValue)}
			/>
			<ul>
				{searchResults.map((searchResult) => {
					const alreadySelected = !!existingPosts.find((_searchResult) => {
						return searchResult.id === _searchResult.id;
					});

					return (
						<li className="splx-searchResult" key={searchResult.id}>
							<div>
								<span className="title">{searchResult.title}&nbsp;</span>
								{searchResult.subtype ? (
									<span className="pill">
										{objectSubTypeLabel(searchResult.subtype)}
									</span>
								) : null}
							</div>

							<Button
								isSecondary
								isSmall
								disabled={alreadySelected}
								onClick={() => onSelectSearchResult(searchResult)}
							>
								{alreadySelected
									? __('Selected', 'solarplexus')
									: __('Select', 'solarplexus')}
							</Button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default SearchPostControl;
