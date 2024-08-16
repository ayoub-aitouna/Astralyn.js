import { withoutNulls } from './utils/array'

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment'
}

export type VDOM_TYPE = {
    type: string;
    tag?: string;
    props?: any;
    value?: string;
    children?: Array<VDOM_TYPE>;
    el?: HTMLElement | any;
    listeners?: any
}

export function h(tag: string, props: any = {}, children: Array<any> = []): VDOM_TYPE {
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT
    }
}


function mapTextNodes(children: Array<any>) {
    return children.map((child) => typeof child === 'string' ? hString(child) : child)
}

export function hString(str: string): VDOM_TYPE {
    return {
        type: DOM_TYPES.TEXT,
        value: str,
    }
}

export function hFragment(children: Array<any>): VDOM_TYPE {
    return {
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.FRAGMENT
    }
}


export function extractChildren(vdom: VDOM_TYPE, indicator = 0): Array<VDOM_TYPE> {
    if (vdom.children == null)
        return []
    const children = []
    for (const child of vdom.children) {
        if (child.type === DOM_TYPES.FRAGMENT) {
            children.push(...extractChildren(child, indicator + 1))
        }
        else
            children.push(child)
    }
    return children;
}


export function lipsum(num: number) {
    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
        enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.`
    return hFragment(Array(num).fill(h('p', {}, [text])))
}