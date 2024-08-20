import { destroyDOM } from "./destroy-dom";
import { DOM_TYPES, extractChildren, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
export function DefineComponent({
	render,
	state,
	...methods
}: {
	render: () => VDOM_TYPE;
	state: (value: any) => any | null;
	[key: string]: any;
}) {
	class Component {
		#vdom: VDOM_TYPE | null = null;
		#hostEl = null;
		props = {};
		state = {};
		#isMounted = false;

		render(): VDOM_TYPE {
			return render.call(this);
		}

		constructor(props: any) {
			this.props = props;
			this.state = state ? state(props) : {};
		}

		updateProps(props: any) {
			this.props = { ...this.props, ...props };
			this.patch();
		}

		updateState(state: any) {
			this.state = { ...this.state, ...state };
			this.patch();
		}

		patch() {
			if (!this.#vdom || !this.#isMounted)
				throw new Error("Component Not Mounted");
			const new_vdom = this.render();
			patchDOM(this.#vdom, new_vdom, this.#hostEl, this);
		}

		get elements(): any {
			if (!this.#vdom) return null;
			if (this.#vdom.tag == DOM_TYPES.FRAGMENT)
				return extractChildren(this.#vdom).flatMap((child) => {
					if (child.type === DOM_TYPES.COMPONENT)
						return (child.component as Component).elements();
					return child.el;
				});
			return this.#vdom.el;
		}

		get firstElement() {
			return this.elements[0];
		}

		get offset() {
			if (this.#vdom?.type === DOM_TYPES.FRAGMENT)
				return Array.from((this.#vdom.el as HTMLElement).children).indexOf(
					this.firstElement
				);
			return 0;
		}

		mount(hostEl: any, index: number | null = null) {
			if (this.#isMounted) throw new Error("Component Already mounted");
			this.#vdom = this.render();
			mountDOM(this.#vdom, hostEl, index, this);
			this.#hostEl = hostEl;
			this.#isMounted = true;
		}

		unmount() {
			if (!this.#isMounted) throw new Error("Component Not Mounted");
			if (!this.#vdom) throw new Error("VDOM is Null");
			destroyDOM(this.#vdom);
			this.#hostEl = null;
			this.#vdom = null;
			this.#isMounted = false;
		}
	}
	for (const methodName in methods) {
		if (Component.hasOwnProperty(methodName)) {
			throw new Error(`Method ${methodName} already exists in Component`);
		}
		Object.defineProperty(Component.prototype, methodName, {
			value: methods[methodName],
			writable: true,
			enumerable: true,
			configurable: true,
		});
	}
	return Component;
}
