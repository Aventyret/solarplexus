import './search-post-control.scss';

const { __ } = window.wp.i18n;
const apiFetch = window.wp.apiFetch;

import { debounce, find } from 'lodash';

import { useEffect, useState, useRef } from '@wordpress/element';

import { TextControl, Button } from '@wordpress/components';

import { useSelect } from '@wordpress/data';

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
		let postTypes = config.allowedPostTypes ? config.allowedPostTypes : [];
		if (config.handpickedPostTypes) {
			postTypes = config.handpickedPostTypes;
		}
		const searchUris = [];
		if (!postTypes.length) {
			// Default to search endpoint if no post types are specified
			searchUris.push(`/wp/v2/search/?search=${searchInput}&per_page=30`);
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

		postTypes.forEach((postType) => {
			// Otherwise do one search for each post type
			const endpoint = `${postType}${
				['post', 'page'].includes(postType) ? 's' : ''
			}`;

			searchUris.push(`/wp/v2/${endpoint}/?search=${searchInput}&per_page=20`);
		});

		const search = async () => {
			const res = await new Promise((resolve, reject) => {
				Promise.all(
					searchUris.map((searchUri) => {
						return apiFetch({ path: searchUri });
					})
				)
					.then((results) => {
						const allResults = results.reduce((all, r, i) => {
							return [
								...all,
								...r.map((p) => {
									// If post type endpoints are used we need to map the results, but not for search endpoint
									if (!postTypes.length) {
										return p;
									}
									return {
										id: p.id,
										title: p.title.rendered,
										url: p.link,
										type: postTypes[i],
										subtype: postTypes[i],
									};
								}),
							];
						}, []);
						resolve(allResults);
					})
					.catch((error) => reject(error));
			});

			const relevanceMatch = searchInput.toLowerCase();
			res.sort((postA, postB) => {
				if (postA.title?.toLowerCase() === relevanceMatch) {
					return -1;
				}
				if (postB.title?.toLowerCase() === relevanceMatch) {
					return 1;
				}
				if (postA.title?.toLowerCase()?.includes(relevanceMatch)) {
					return -1;
				}
				if (postB.title?.toLowerCase()?.includes(relevanceMatch)) {
					return 1;
				}
				return 0;
			});

			setSearchResults(res.slice(0, 10));
		};
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
	}, 250);

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
			<h4>{__('Search posts', 'splx')}</h4>
			<TextControl
				ref={inputRef}
				onChange={(nextValue) => onSearchInputChange(nextValue)}
			/>
			<ul>
				{searchResults.map((searchResult) => {
					const alreadySelected = !!find(existingPosts, (_searchResult) => {
						return searchResult.id === _searchResult.id;
					});

					return (
						<li className="splx-searchResult" key={searchResult.id}>
							<div>
								<span className="title">{searchResult.title}&nbsp;</span>
								{searchResult.subtype ? (
									<span className="pill">{objectSubTypeLabel(searchResult.subtype)}</span>
								) : null}
							</div>

							<Button
								isSecondary
								isSmall
								disabled={alreadySelected}
								onClick={() => onSelectSearchResult(searchResult)}
							>
								{alreadySelected
									? __('Selected', 'splx')
									: __('Select', 'splx')}
							</Button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default SearchPostControl;
