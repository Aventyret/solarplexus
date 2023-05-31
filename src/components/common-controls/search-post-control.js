import './search-post-control.scss';

const { __ } = window.wp.i18n;
const apiFetch = window.wp.apiFetch;

import { debounce, find } from 'lodash';

import { useEffect, useState } from '@wordpress/element';

import { TextControl, Button } from '@wordpress/components';

import { useSelect } from '@wordpress/data';

const SearchPostControl = ({ existingPosts, config, selectSearchResult }) => {
	const [searchInput, setSearchInput] = useState('');
	const [searchResults, setSearchResults] = useState([]);

	const availablePostTypes = useSelect((select) => {
		const { getPostTypes } = select('core');
		const postTypes = getPostTypes({ per_page: -1 });

		return postTypes && config.allowedPostTypes
			? postTypes
					.filter((postType) => {
						return config.allowedPostTypes.includes(postType.slug);
					})
					.map((postType) => postType.slug)
			: null;
	}, []);

	useEffect(() => {
		let postTypes = config.allowedPostTypes ? config.allowedPostTypes : [];
		if (config.handpickedPostTypes) {
			postTypes = config.handpickedPostTypes;
		}
		const searchUris = [];
		if (!postTypes.length) {
			// Default to search endpoint if no post types are specified
			searchUris.push(`/wp/v2/search/?search=${searchInput}`);
		}

		// Filter out post types that are not available
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

			searchUris.push(`/wp/v2/${endpoint}/?search=${searchInput}`);
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
		if (searchInput.length > 2) search();
	}, [searchInput, availablePostTypes]);

	const onSearchInputChange = debounce((value) => {
		setSearchInput(value);
	}, 250);

	return (
		<div>
			<h4>{__('Search', 'splx')}</h4>
			<TextControl onChange={(nextValue) => onSearchInputChange(nextValue)} />
			<ul>
				{searchResults.map((searchResult) => {
					const alreadySelected = !!find(existingPosts, (_searchResult) => {
						return searchResult.id === _searchResult.id;
					});

					return (
						<li className="splx-searchResult" key={searchResult.id}>
							<div>
								<em>{searchResult.title}</em>
								<span>{__(searchResult.subtype, 'splx')}</span>
							</div>

							<Button
								isSecondary
								isSmall
								disabled={alreadySelected}
								onClick={() => selectSearchResult(searchResult)}
							>
								{alreadySelected
									? __('Already selected', 'splx')
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
