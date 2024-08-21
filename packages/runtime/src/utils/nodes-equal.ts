import { DOM_TYPES } from "../h";

export function areNodesEqual(node: any, otherNode: any) {
	if (node.type !== otherNode.type) return false;
	if (node.type === DOM_TYPES.ELEMENT && node.tag !== otherNode.tag)
		return false;
	if (node.type === DOM_TYPES.COMPONENT) {
		if (node.tag !== otherNode.tag || node.props.key !== otherNode.props.key)
			return false;
	}
	return true;
}
