function debounce(fn, timeoutMs = 250) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, timeoutMs);
	};
}

export default debounce;
