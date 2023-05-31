/* eslint-disable no-prototype-builtins */
export const formatYYYYMMDDHHMMSS = (date: Date) => {
	function pad2(n: number) {
		return (n < 10 ? '0' : '') + n;
	}

	return (
		date.getFullYear() +
    pad2(date.getMonth() + 1) +
    pad2(date.getDate()) +
    pad2(date.getHours()) +
    pad2(date.getMinutes()) +
    pad2(date.getSeconds())
	);
};

export const formatHHMMSS = (date: Date) => {
	const hhmmss =
    ('0' + date.getHours()).slice(-2) +
    ('0' + date.getMinutes()).slice(-2) +
    ('0' + date.getSeconds()).slice(-2);
	return hhmmss;
};

export const sortObject = <T>(obj: T): T => {
	const sorted = {};
	const str = [];
	let key: string | number | symbol;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}
	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return <T>sorted;
};
