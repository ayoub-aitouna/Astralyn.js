import { destroyDOM } from "./destroy-dom";
import { DOM_TYPES, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { areNodesEqual } from "./utils/nodes-equal";
import { objectDiff } from "./utils/objects";
import { removeAttribute, setAttribute, setStyle } from "./attributes";

export function patchDOM(
  vdom: VDOM_TYPE,
  new_vdom: VDOM_TYPE,
  parentEl: any
): VDOM_TYPE | null {
  if (!areNodesEqual(vdom, new_vdom)) {
    const index = findIndexInParent(parentEl, vdom?.el);
    destroyDOM(vdom);
    mountDOM(new_vdom, parentEl, index);
  }
  new_vdom.el = vdom.el;
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      patchText(vdom, new_vdom);
      break;
    case DOM_TYPES.ELEMENT:
      pathElement(vdom, new_vdom);
      break;
    case DOM_TYPES.FRAGMENT:
      if (vdom.children?.length) {
        pathChildren(vdom, new_vdom);
      }
      break;
  }
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
function pathElement(vdom: VDOM_TYPE, new_vdom: VDOM_TYPE) {
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
  const { listeners: oldListerners } = vdom;

  pathAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  new_vdom.listeners = patchEvent(el, oldListerners, oldEvents, newEvents);
  if (vdom.children?.length) {
    pathChildren(vdom, new_vdom);
  }
}

function pathAttrs(el: any, oldAttrs: any, newAttrs: any) {
  const { added, removed, updated } = objectDiff(oldAttrs, newAttrs);

  for (const attr of removed) removeAttribute(el, attr);

  for (const attr of added.concat(updated))
    setAttribute(el, attr, oldAttrs[attr]);
}

function patchClasses(el: any, oldClass: any, newClass: any) {}

function patchStyles(el: any, oldStyle: any, newStyle: any) {}
function patchEvent(
  el: any,
  oldListerners: any,
  oldEvents: any,
  newEvents: any
) {}

function pathChildren(vdom: VDOM_TYPE, new_vdom: VDOM_TYPE) {}
