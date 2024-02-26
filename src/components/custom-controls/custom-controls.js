import CustomSelectControl from './custom-select-control';
import CustomTextControl from './custom-text-control';
import CustomTextareaControl from './custom-textarea-control';

const CustomControls = ({
	attributes,
	setAttributes,
	config,
	searchResult = false,
	isPostCustomControls = false,
}) => {
	const customControls = isPostCustomControls
		? config.postCustomControls
		: config.customControls;

	if (!customControls || !customControls.length) {
		return null;
	}

	return customControls.map((control) => {
		let controlKey = `${searchResult.id}-${control.id}`;

		if (isPostCustomControls) {
			controlKey = `${searchResult.id}_${control.id}`;
		}

		if (control.type === 'select') {
			return (
				<CustomSelectControl
					key={controlKey}
					attributes={attributes}
					setAttributes={setAttributes}
					control={control}
					searchResult={searchResult}
					isPostCustomControl={isPostCustomControls}
				/>
			);
		}
		if (control.type === 'text') {
			return (
				<CustomTextControl
					key={controlKey}
					attributes={attributes}
					setAttributes={setAttributes}
					control={control}
					searchResult={searchResult}
					isPostCustomControl={isPostCustomControls}
				/>
			);
		}
		if (control.type === 'textarea') {
			return (
				<CustomTextareaControl
					key={controlKey}
					attributes={attributes}
					setAttributes={setAttributes}
					control={control}
					searchResult={searchResult}
					isPostCustomControl={isPostCustomControls}
				/>
			);
		}
		return null;
	});
};

export default CustomControls;
