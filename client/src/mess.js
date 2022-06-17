function getCookie(name) {
	const cookies = document.cookie ? document.cookie.split("; ") : [];
	const cookie = cookies.length ? cookies.find(row => row.includes(name)).split("=")[1] : null;
	return cookie;
}

function setCookie(name, value, duration) {
	const date = new Date();
	date.setTime(date.getTime() + duration);
	document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
}

function deleteCookie(name) {
	setCookie(name, "", -1);
}

function uniqueId() {
	return Math.random().toString(36).slice(2, 9);
}

module.exports = {
	getCookie,
	setCookie,
	uniqueId,
	deleteCookie,
};
