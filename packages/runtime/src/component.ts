import { destroyDOM } from "./destroy-dom";
import { DOM_TYPES, extractChildren, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";

export function DefineComponent({ render, state }: { render: () => VDOM_TYPE, state: (value: any) => any | null }) {
    class Component {
        #vdom: VDOM_TYPE | null = null;
        #hostEl = null;
        props = null;
        state = {};
        #isMounted = false;

        render(): VDOM_TYPE {
            return render.call(this);
        }

        constructor(props: any) {
            this.props = props;
            this.state = state ? state(props) : {}
        }

        updateState(new_state: any) {
            this.state = { ...this.state, ...new_state };
            this.patch()
        }

        patch() {
            if (!this.#vdom || !this.#isMounted)
                throw new Error('Component Not Mounted')
            const new_vdom = render();
            patchDOM(this.#vdom, new_vdom, this.#hostEl, this)
        }

        get elements() {
            if (!this.#vdom)
                return null;
            if (this.#vdom.tag == DOM_TYPES.FRAGMENT)
                return extractChildren(this.#vdom).map((child) => child.el)
            return this.#vdom.el;
        }

        get firstElement() {
            return this.elements[0]
        }

        get offset() {
            if (this.#vdom?.type === DOM_TYPES.FRAGMENT)
                return Array.from((this.#vdom.el as HTMLElement).children).indexOf(this.firstElement)
            return 0;
        }

        mount(hostEl: any, index: number | null = null) {
            if (this.#isMounted)
                throw new Error('Component Already mounted')
            this.#vdom = this.render();
            mountDOM(this.#vdom, hostEl, index)
            this.#hostEl = hostEl;
            this.#isMounted = true;
        }

        unmount() {
            if (!this.#isMounted)
                throw new Error('Component Not Mounted')
            if (!this.#vdom)
                throw new Error('VDOM is Null')
            destroyDOM(this.#vdom)
            this.#hostEl = null;
            this.#vdom = null;
            this.#isMounted = false;
        }
    }
    return Component;
}