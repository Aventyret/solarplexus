const { __ } = window.wp.i18n;

import { TextControl } from '@wordpress/components';

// Returns local time in format suitable for <input type=dateime-local />
const getDateTimeLocalString = (dateString) => {
	if (dateString) {
		const d = new Date(dateString);
		return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
			.toISOString()
			.slice(0, -1);
	}
	return '';
};

const SchedulingControls = ({ attributes, setAttributes }) => {
	const onPublishAtDateTimeChange = (publishAt) => {
		// Note: Storing as UTC string
		setAttributes({
			publishAt: publishAt && new Date(publishAt).toISOString(),
		});
	};
	const onUnpublishAtDateTimeChange = (unpublishAt) => {
		// Note: Storing as UTC string
		setAttributes({
			unpublishAt: unpublishAt && new Date(unpublishAt).toISOString(),
		});
	};

	return (
		<>
			<TextControl
				label={__('Publish at', 'splx')}
				onChange={onPublishAtDateTimeChange}
				type="datetime-local"
				value={getDateTimeLocalString(attributes.publishAt)}
				max={getDateTimeLocalString(attributes.unpublishAt)}
			/>
			<TextControl
				label={__('Unpublish at', 'splx')}
				onChange={onUnpublishAtDateTimeChange}
				type="datetime-local"
				value={getDateTimeLocalString(attributes.unpublishAt)}
				min={getDateTimeLocalString(attributes.publishAt)}
			/>
		</>
	);
};

export default SchedulingControls;
