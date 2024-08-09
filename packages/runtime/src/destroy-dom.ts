import { VDOM_TYPE, DOM_TYPES } from "./h";
import { removeEventListeners } from "./events";

export function destroyDOM(vdom: VDOM_TYPE) {
    const { type } = vdom;
    switch (type) {
        case DOM_TYPES.TEXT:
            removeTextNode(vdom);
            break;
        case DOM_TYPES.FRAGMENT:
            removeFragmentNode(vdom);
            break;
        case DOM_TYPES.ELEMENT:
            removeElementNode(vdom);
            break;
        default:
            throw new Error(`Can't Destory DOM of type: ${vdom.type}`)
    }
}


function removeTextNode(vdom: VDOM_TYPE) {
    const { el } = vdom;
    el.remove()
}

function removeElementNode(vdom: VDOM_TYPE) {
    const { children, el, listeners } = vdom;
    children?.forEach(destroyDOM)
    el.remove()
    if (listeners) {
        removeEventListeners(listeners, el)
        delete vdom.listeners;
    }
}

function removeFragmentNode(vdom: VDOM_TYPE) {
    const { children } = vdom;
    children?.forEach(destroyDOM)
}