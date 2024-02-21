import './shared.scss';

import { useEffect } from '@wordpress/element';

import ServerSideRender from '@wordpress/server-side-render';

import { registerBlockType } from '@wordpress/blocks';

import DynamicInspectorControls from './components/dynamic-inspector-controls/dynamic-inspector-controls';
import HandpickedInspectorControls from './components/handpicked-inspector-controls/handpicked-inspector-controls';
import Toolbar from './components/toolbar/toolbar';

// solarplexusConfig and solarplexusAttrDefs
// are global window variables
// outputted in class-solarplexus-admin.php

const getCustomSvgJsx = (icon) => {
	// console.log(icon.startsWith('<svg'));
	return function () {
		const html = icon.startsWith('<svg') ? icon : svgIcons[icon];
		return (
			<span className="splx-icon" dangerouslySetInnerHTML={{ __html: html }} />
		);
	};
};

window.solarplexusConfig.forEach((config) => {
	const blockId = `splx/${config.id}`;
	const attributes = window.solarplexusAttrDefs[config.id];
	if (!attributes) {
		console.error(
			`Solarplexus: No attributes found for ${attributes}, skipping`
		);
		return;
	}
	console.log(`Solarplexus: Attributes for ${config.id}`, attributes);

	const icon = config.icon
		? getCustomSvgJsx(config.icon)
		: getCustomSvgJsx('default');

	registerBlockType(blockId, {
		title: config.title,
		icon: icon,
		category: 'layout',
		example: {},
		attributes,
		edit(props) {
			useEffect(() => {
				if (!props.attributes.blockUid) {
					props.setAttributes({ blockUid: props.clientId });
				}
			}, []);

			return (
				<>
					{config.type === 'dynamic' ? (
						<DynamicInspectorControls {...props} config={config} />
					) : config.type === 'handpicked' ? (
						<HandpickedInspectorControls {...props} config={config} />
					) : null}
					<Toolbar {...props} config={config} />

					<ServerSideRender
						attributes={props.attributes}
						block={blockId}
						httpMethod="POST"
					/>
				</>
			);
		},
		save() {
			return null;
		},
	});
});

const svgIcons = {
	default: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path style="stroke:none;fill-rule:nonzero;fill:#e3e0d9;fill-opacity:1" d="M11.152 5.242h-6.62l-.759 2.363h7.38Zm0 0"/><path style="stroke:none;fill-rule:nonzero;fill:#f2e4c0;fill-opacity:1" d="M1.844 14.227a.277.277 0 0 0-.262.191L.508 17.762a.562.562 0 0 0 .078.496c.105.14.27.226.445.226h9.57c.305 0 .551-.25.551-.554v-3.426a.275.275 0 0 0-.273-.277Zm0 0"/><path style="stroke:none;fill-rule:nonzero;fill:#e3e0d9;fill-opacity:1" d="M13.32 14.227a.278.278 0 0 0-.277.277v3.426c0 .304.25.554.555.554h9.566a.553.553 0 0 0 .523-.722l-1.074-3.344a.273.273 0 0 0-.261-.191Zm0 0"/><path style="stroke:none;fill-rule:nonzero;fill:#c8e0e8;fill-opacity:1" d="m19.664 5.242.762 2.363h-7.383V5.242Zm0 0"/><path style="stroke:none;fill-rule:nonzero;fill:#fff;fill-opacity:1" d="m20.965 9.379.828 2.898H2.343L3.31 9.38Zm0 0"/><path style="stroke:none;fill-rule:nonzero;fill:#2d3e4f;fill-opacity:1" d="M4.531 5.242v-.207h-.148l-.047.145Zm6.621 0h.207v-.207h-.207ZM3.773 7.605l-.199-.062-.086.27h.285Zm7.38 0v.207h.206v-.207ZM3.163 9.496V9.29h-.152l-.043.145Zm17.867 0 .2-.062-.047-.145h-.153Zm-.605-1.89v.207h.281l-.086-.27Zm-.762-2.364.2-.062-.048-.145h-.152Zm-6.621 2.363h-.207v.207h.207Zm0-2.363v-.207h-.207v.207Zm-8.512.207h6.621v-.414h-6.62ZM3.97 7.668l.761-2.363-.394-.125-.762 2.363Zm7.183-.27H3.773v.415h7.38Zm-.207-2.156v2.363h.414V5.242ZM2.97 9.434l-.797 2.476.394.13.793-2.477Zm-1.582 4.921L.312 17.7l.391.125 1.078-3.344Zm-.356 4.336h9.57v-.414h-9.57Zm10.328-.761v-3.426h-.414v3.426Zm-.48-3.91H1.844v.414h9.035Zm2.371 3.91v-3.426h-.414v3.426Zm9.914.347h-9.566v.414h9.566Zm-.746-3.797 1.074 3.344.395-.125-1.075-3.344Zm-.066-.46H13.32v.414h9.032Zm-1.516-4.457.797 2.476.394-.129-.797-2.476Zm-.215-2.02-.758-2.363-.394.125.758 2.363Zm-7.578.27h7.383v-.415h-7.383Zm-.207-2.57v2.362h.414V5.242Zm6.828-.208h-6.621v.414h6.621ZM2.63 12.543h18.937v-.414H2.63Zm.535-2.84h17.871v-.41H3.165Zm18.469 2.336a.063.063 0 0 1-.012.063.068.068 0 0 1-.055.027v.414a.48.48 0 0 0 .391-.2.49.49 0 0 0 .07-.433Zm1.18 2.316a.487.487 0 0 0-.461-.335v.414c.03 0 .058.02.066.046Zm.351 4.336a.759.759 0 0 0 .723-.992l-.395.125a.335.335 0 0 1-.05.309.34.34 0 0 1-.278.144Zm-9.914-4.187c0-.04.031-.07.07-.07v-.414a.484.484 0 0 0-.484.484Zm-.414 3.426c0 .422.34.761.762.761v-.414a.348.348 0 0 1-.348-.347Zm-1.477-3.426a.481.481 0 0 0-.48-.484v.414c.035 0 .066.03.066.07Zm-.757 4.187a.76.76 0 0 0 .757-.761h-.414a.345.345 0 0 1-.343.347ZM.312 17.7a.765.765 0 0 0 .106.68.764.764 0 0 0 .613.312v-.414a.346.346 0 0 1-.277-.144.346.346 0 0 1-.05-.309Zm1.47-3.219a.067.067 0 0 1 .062-.046v-.414a.482.482 0 0 0-.457.335Zm.39-2.57a.478.478 0 0 0 .07.434c.09.125.235.199.387.199v-.414a.075.075 0 0 1-.055-.027.072.072 0 0 1-.008-.063Zm0 0"/></svg>`,
	article: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="14" rx="1" fill="black"/><path d="M1 18H23" stroke="black" stroke-width="2" stroke-linecap="round"/><path d="M1 22H8" stroke="black" stroke-width="2" stroke-linecap="round"/><path d="M12 22H18" stroke="black" stroke-width="2" stroke-linecap="round"/></svg>`,
	articles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_59_22)"><rect width="11" height="10" rx="1" fill="black"/><rect y="14" width="11" height="10" rx="1" fill="black"/><path d="M14 1H23" stroke="black" stroke-width="2" stroke-linecap="round"/><path d="M14 15H21" stroke="black" stroke-width="2" stroke-linecap="round"/><path d="M14 5H17" stroke="black" stroke-width="2" stroke-linecap="round"/><path d="M14 19H16" stroke="black" stroke-width="2" stroke-linecap="round"/></g><defs><clipPath id="clip0_59_22"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>`,
	'1-col': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="22" height="6" rx="1" fill="black"/><rect x="1" y="9" width="22" height="6" rx="1" fill="black"/><rect x="1" y="17" width="22" height="6" rx="1" fill="black"/></svg>`,
	'2-col': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="3" width="11" height="18" rx="1" fill="black"/><rect x="13" y="3" width="11" height="18" rx="1" fill="black"/></svg>`,
	'3-col': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="6" height="18" rx="1" fill="black"/><rect x="9" y="3" width="6" height="18" rx="1" fill="black"/><rect x="17" y="3" width="6" height="18" rx="1" fill="black"/></svg>`,
	'4-col': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="4" height="18" rx="1" fill="black"/><rect x="7" y="3" width="4" height="18" rx="1" fill="black"/><rect x="13" y="3" width="4" height="18" rx="1" fill="black"/><rect x="19" y="3" width="4" height="18" rx="1" fill="black"/></svg>`,
	'2-col-grid': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="2" width="11" height="9" rx="1" fill="black"/><rect y="13" width="11" height="9" rx="1" fill="black"/><rect x="13" y="2" width="11" height="9" rx="1" fill="black"/><rect x="13" y="13" width="11" height="9" rx="1" fill="black"/></svg>`,
	'3-col-grid': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="6" height="9" rx="1" fill="black"/><rect x="1" y="13" width="6" height="9" rx="1" fill="black"/><rect x="9" y="2" width="6" height="9" rx="1" fill="black"/><rect x="9" y="13" width="6" height="9" rx="1" fill="black"/><rect x="17" y="2" width="6" height="9" rx="1" fill="black"/><rect x="17" y="13" width="6" height="9" rx="1" fill="black"/></svg>`,
	'4-col-grid': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="4" height="9" rx="1" fill="black"/><rect x="1" y="13" width="4" height="9" rx="1" fill="black"/><rect x="7" y="2" width="4" height="9" rx="1" fill="black"/><rect x="7" y="13" width="4" height="9" rx="1" fill="black"/><rect x="13" y="2" width="4" height="9" rx="1" fill="black"/><rect x="13" y="13" width="4" height="9" rx="1" fill="black"/><rect x="19" y="2" width="4" height="9" rx="1" fill="black"/><rect x="19" y="13" width="4" height="9" rx="1" fill="black"/></svg>`,
	masonry: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="2" width="6" height="13" rx="1" fill="black"/><rect x="1" y="17" width="6" height="5" rx="1" fill="black"/><rect x="9" y="2" width="6" height="5" rx="1" fill="black"/><rect x="17" y="13" width="6" height="9" rx="1" fill="black"/><rect x="9" y="9" width="6" height="13" rx="1" fill="black"/><rect x="17" y="2" width="6" height="9" rx="1" fill="black"/></svg>`,
};
