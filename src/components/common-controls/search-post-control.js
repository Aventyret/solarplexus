import './search-post-control.scss';

const { __, sprintf } = wp.i18n;
const apiFetch = wp.apiFetch;

import { debounce, find } from 'lodash';

import { useEffect, useState } from '@wordpress/element';

import { TextControl, Button } from '@wordpress/components';

const SearchPostControl = ( {
	attributes,
	existingPosts,
	config,
	selectSearchResult,
} ) => {
	const [ searchInput, setSearchInput ] = useState( '' );
	const [ searchResults, setSearchResults ] = useState( [] );

	useEffect( () => {
		const postTypes = config.allowedPostTypes
			? config.allowedPostTypes
			: [];
		const searchUris = [];
		if ( ! postTypes.length ) {
			// Default to search endpoint if no post types are specified
			searchUris.push( `/wp/v2/search/?search=${ searchInput }` );
		}
		postTypes.forEach( ( postType ) => {
			// Otherwise do one search for each post type
			const endpoint = `${ postType }${
				[ 'post', 'page' ].includes( postType ) ? 's' : ''
			}`;
			searchUris.push( `/wp/v2/${ endpoint }/?search=${ searchInput }` );
		} );
		const search = async () => {
			const res = await new Promise( ( resolve, reject ) => {
				Promise.all(
					searchUris.map( ( searchUri ) => {
						return apiFetch( { path: searchUri } );
					} )
				)
					.then( ( results ) => {
						const allResults = results.reduce( ( all, r, i ) => {
							return [
								...all,
								...r.map( ( p ) => {
									// If post type endpoints are used we need to map the results, but not for search endpoint
									if ( ! postTypes.length ) {
										return p;
									}
									return {
										id: p.id,
										title: p.title.rendered,
										url: p.link,
										type: postTypes[ i ],
										subtype: postTypes[ i ],
									};
								} ),
							];
						}, [] );
						resolve( allResults.slice( 0, 10 ) );
					} )
					.catch( ( error ) => reject( error ) );
			} );

			setSearchResults( res );
		};
		if ( searchInput.length > 2 ) search();
	}, [ searchInput ] );

	const onSearchInputChange = debounce( ( value ) => {
		setSearchInput( value );
	}, 250 );

	return (
		<div>
			<h4>{ __( 'Search', 'splx' ) }</h4>
			<TextControl
				onChange={ ( nextValue ) => onSearchInputChange( nextValue ) }
			/>
			<ul>
				{ searchResults.map( ( searchResult ) => {
					const alreadySelected = !! find(
						existingPosts,
						( _searchResult ) => {
							return searchResult.id === _searchResult.id;
						}
					);

					const maxReached =
						existingPosts.length >= attributes.noOfPosts;
					let buttonText = __( 'Select', 'splx' );
					if ( alreadySelected ) {
						buttonText = __( 'Already selected', 'splx' );
					}
					if ( ! alreadySelected && maxReached ) {
						buttonText = sprintf(
							/* translators: %d is the maximum number of posts */
							__( "You can't select more than %d posts", 'splx' ),
							attributes.noOfPosts
						);
					}

					const subTypeText = __( searchResult.subtype, 'splx' ); // eslint-disable-line @wordpress/i18n-no-variables

					return (
						<li
							className="splx-searchResult"
							key={ searchResult.id }
						>
							<div>
								<em>{ searchResult.title }</em>
								<span>{ subTypeText }</span>
							</div>

							<Button
								isSecondary
								isSmall
								disabled={ alreadySelected || maxReached }
								onClick={ () =>
									selectSearchResult( searchResult )
								}
							>
								{ buttonText }
							</Button>
						</li>
					);
				} ) }
			</ul>
		</div>
	);
};

export default SearchPostControl;
