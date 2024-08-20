type OBJDIFF = {
	added: Array<string>;
	removed: Array<string>;
	updated: Array<string>;
};
export function objectDiff(oldObj: any, newObj: any): OBJDIFF {
	const oldObjKeys = Object.keys(oldObj || {});
	const newObjKeys = Object.keys(newObj || {});
	return {
		added: newObjKeys.filter((key) => !(key in oldObj)),
		removed: oldObjKeys.filter((key) => !(key in newObj)),
		updated: newObjKeys.filter(
			(key) => key in oldObj && oldObj[key] !== newObj[key]
		),
	};
}

