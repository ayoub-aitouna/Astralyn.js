import { DOM_TYPES, VDOM_TYPE } from "./h";
import { setAttributes } from './attributes'
import { addEventListeners } from "./events";

export function mountDOM(vdom: VDOM_TYPE, parentEl: any) {
    switch (vdom.type) {
        case DOM_TYPES.TEXT:
            createTextNode(vdom, parentEl);
            break;

        case DOM_TYPES.ELEMENT:
            createElementNode(vdom, parentEl);
            break;

        case DOM_TYPES.FRAGMENT:
            createFragmentNode(vdom, parentEl);
            break;

        default:
            throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
}

function createTextNode(vdom: VDOM_TYPE, parentEl: any) {
    const { value } = vdom;
    const TextNode = document.createTextNode(value as string);
    vdom.el = TextNode;
    parentEl.append(TextNode);

}

function createElementNode(vdom: VDOM_TYPE, parentEl: any) {
    const { tag, props, children } = vdom;
    const element = document.createElement(tag as string);
    
    addProps(element, props, vdom);
    vdom.el = element;

    children?.forEach((child) => mountDOM(child, element));
    parentEl.append(element);
}

function createFragmentNode(vdom: VDOM_TYPE, parentEl: any) {
    vdom.el = parentEl;
    vdom.children?.forEach((child) => mountDOM(child, parentEl))
}


function addProps(el: any, props: any, vdom: VDOM_TYPE) {
    const { on: events, ...attrs } = props;
    vdom.listeners = addEventListeners(events, el);
    setAttributes(el, attrs)
}