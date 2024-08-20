import { destroyDOM } from "./destroy-dom";
import { DOM_TYPES, extractChildren, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { areNodesEqual } from "./utils/nodes-equal";
import { objectDiff } from "./utils/objects";
import {
	removeAttribute,
	removeStyle,
	setAttribute,
	setStyle,
} from "./attributes";
import { ArrayDiff, arraysDiffSequence, ARRAY_DIFF_OP } from "./utils/array";
import { isNotBlankOrEmptyString } from "./utils/strings";
import { addEventListener } from "./events";

export function patchDOM(
	vdom: VDOM_TYPE,
	new_vdom: VDOM_TYPE,
	parentEl: any,
	hostComponent: any = null
): VDOM_TYPE | null {
	if (!areNodesEqual(vdom, new_vdom)) {
		const index = findIndexInParent(parentEl, vdom?.el);
		destroyDOM(vdom);
		mountDOM(new_vdom, parentEl, index, hostComponent);
	}
	new_vdom.el = vdom.el;
	switch (vdom.type) {
		case DOM_TYPES.TEXT:
			patchText(vdom, new_vdom);
			return new_vdom;
		case DOM_TYPES.ELEMENT:
			patchElement(vdom, new_vdom, hostComponent);
			break;
		case DOM_TYPES.COMPONENT:
			patchComponent(vdom, new_vdom);
			break;
	}
	patchChildren(vdom, new_vdom);
	return new_vdom;
}

function findIndexInParent(parentEl: HTMLElement, el: any): number | null {
	const index = Array.from(parentEl.childNodes).indexOf(el);
	return index < 0 ? null : index;
}

function patchText(vdom: VDOM_TYPE, new_vdom: VDOM_TYPE) {
	const el = vdom.el;
	const { value: oldText } = vdom;
	const { value: newText } = new_vdom;
	if (oldText !== newText) {
		el.nodeValue = newText;
	}
}

function patchElement(
	vdom: VDOM_TYPE,
	new_vdom: VDOM_TYPE,
	hostComponent: any = null
) {
	const el = vdom.el;
	const {
		class: oldClass,
		style: oldStyle,
		on: oldEvents,
		...oldAttrs
	} = vdom.props;

	const {
		class: newClass,
		style: newStyle,
		on: newEvents,
		...newAttrs
	} = new_vdom.props;

	const { listeners: oldListeners } = vdom;
	patchAttrs(el, oldAttrs, newAttrs);
	patchClasses(el, oldClass, newClass);
	patchStyles(el, oldStyle, newStyle);
	new_vdom.listeners = patchEvents(
		el,
		oldListeners,
		oldEvents,
		newEvents,
		hostComponent
	);
}

function patchAttrs(el: any, oldAttrs: any, newAttrs: any) {
	const { added, removed, updated } = objectDiff(oldAttrs, newAttrs);

	for (const attr of removed) removeAttribute(el, attr);

	for (const attr of added.concat(updated))
		setAttribute(el, attr, newAttrs[attr]);
}

function patchClasses(el: HTMLElement, oldClass: any, newClass: any) {
	const { added, removed } = ArrayDiff(
		toClassList(oldClass),
		toClassList(newClass)
	);
	if (added.length > 0) el.classList.add(...added);
	if (removed.length > 0) el.classList.remove(...removed);
}

function patchStyles(el: any, oldStyle: any, newStyle: any) {
	const { added, updated, removed } = objectDiff(oldStyle, newStyle);
	for (const style of removed) removeStyle(el, style);
	for (const style of added.concat(updated))
		setStyle(el, style, newStyle[style]);
}

function patchEvents(
	el: HTMLElement,
	oldListeners: any,
	oldEvents: any,
	newEvents: any,
	hostComponent: any = null
) {
	const { added, updated, removed } = objectDiff(oldEvents, newEvents);
	for (const eventName of removed.concat(updated))
		el.removeEventListener(eventName, oldListeners[eventName]);

	const addedListeners: any = {};
	for (const event of added.concat(updated))
		addedListeners[event] = addEventListener(
			event,
			newEvents[event],
			el,
			hostComponent
		);

	return addedListeners;
}

function patchChildren(
	vdom: VDOM_TYPE,
	new_vdom: VDOM_TYPE,
	hostComponent: any = null
) {
	const oldChildren = extractChildren(vdom);
	const newChildren = extractChildren(new_vdom);
	const parentEl = vdom.el as HTMLElement;
	const sequences = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);
	const offset = hostComponent?.offset ?? 0;

	for (const seq of sequences) {
		const { originalIndex, index, item } = seq;
		switch (seq.op) {
			case ARRAY_DIFF_OP.ADD:
				mountDOM(item, vdom.el, index + offset, hostComponent);
				break;
			case ARRAY_DIFF_OP.REMOVE:
				destroyDOM(item);
				break;
			case ARRAY_DIFF_OP.MOVE:
				const oldChild = oldChildren[originalIndex];
				const newChild = newChildren[index];

				const el = oldChild.el;

				const elAtTargetIndex = parentEl.childNodes[index + offset];

				parentEl.insertBefore(el, elAtTargetIndex);
				patchDOM(oldChild, newChild, parentEl, hostComponent);
				break;
			case ARRAY_DIFF_OP.NOOP:
				patchDOM(
					oldChildren[originalIndex],
					newChildren[index],
					parentEl,
					hostComponent
				);
				break;
		}
	}
}

function toClassList(classes: any = "") {
	let list: any[] = classes;
	if (typeof classes == "string") list = classes.split(/(\s+)/);
	return list
		.map((item: string) => item.trim())
		.filter(isNotBlankOrEmptyString);
}
function patchComponent(vdom: VDOM_TYPE, new_vdom: VDOM_TYPE) {
	const { props } = new_vdom;
	vdom.component.updateProps(props);
	new_vdom.component = vdom.component;
	new_vdom.el = new_vdom.component.firstElement;
}
