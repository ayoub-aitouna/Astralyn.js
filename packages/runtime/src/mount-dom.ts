import { DOM_TYPES, VDOM_TYPE } from "./h";
import { setAttributes } from "./attributes";
import { addEventListeners } from "./events";

export function mountDOM(
  vdom: VDOM_TYPE,
  parentEl: any,
  index: number | null = null
) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT:
      createTextNode(vdom, parentEl, index);
      break;

    case DOM_TYPES.ELEMENT:
      createElementNode(vdom, parentEl, index);
      break;

    case DOM_TYPES.FRAGMENT:
      createFragmentNode(vdom, parentEl, index);
      break;

    default:
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
  }
}

function createTextNode(vdom: VDOM_TYPE, parentEl: any, index: number | null) {
  const { value } = vdom;
  const TextNode = document.createTextNode(value as string);
  vdom.el = TextNode;
  insert(index, TextNode, parentEl);
}

function createElementNode(
  vdom: VDOM_TYPE,
  parentEl: any,
  index: number | null
) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag as string);

  addProps(element, props, vdom);
  vdom.el = element;

  children?.forEach((child) => mountDOM(child, element));
  insert(index, element, parentEl);
}

function createFragmentNode(
  vdom: VDOM_TYPE,
  parentEl: any,
  index: number | null
) {
  vdom.el = parentEl;
  vdom.children?.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null)
  );
}

function addProps(el: any, props: any, vdom: VDOM_TYPE) {
  const { on: events, ...attrs } = props;
  vdom.listeners = addEventListeners(events, el);
  setAttributes(el, attrs);
}

function insert(index: number | null, el: any, parentEl: HTMLElement): void {
  if (!index) return parentEl.append(el);
  if (index < 0)
    throw new Error(`Index must be a positive integer, got ${index}`);
  if (index >= parentEl.childNodes.length) return parentEl.append(el);
  const node = parentEl.childNodes[index];
  parentEl.insertBefore(el, node);
}
