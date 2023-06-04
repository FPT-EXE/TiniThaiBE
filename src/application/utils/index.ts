import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

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

export function toMongoObjectId({ value, key }: {value: string, key: string}): Types.ObjectId {
	const objectId = new Types.ObjectId(value);
	if (Types.ObjectId.isValid(value) && (objectId.toString() === value)) {
		return objectId;
	} else {
		throw new BadRequestException(`${key} is not a valid MongoId`);
	}
}
