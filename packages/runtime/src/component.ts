import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { DOM_TYPES, extractChildren, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { patchDOM } from "./patch-dom";
import equal from "fast-deep-equal";

	
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
		#eventHandlers: any = {};
		#parentComponent: Component | null = null;
		#dispatcher = new Dispatcher();
		#subscriptions: any[] = [];

		render(): VDOM_TYPE {
			return render.call(this);
		}

		constructor(
			props: any,
			eventHandlers: any = {},
			parentComponent: Component | null = null
		) {
			this.props = props;
			this.state = state ? state(props) : {};
			this.#eventHandlers = eventHandlers;
			this.#parentComponent = parentComponent;
		}

		updateProps(props: any, eventHandlers: any = {}) {
			const newProps = { ...this.props, ...props };
			const newEventHandlers = { ...this.#eventHandlers, ...eventHandlers };
			if (
				equal(this.props, newProps) &&
				equal(this.#eventHandlers, newEventHandlers)
			)
				return;
			this.props = newProps;
			this.#eventHandlers = newEventHandlers;

			this.patch();

			// TODO: optimize this by only updating the event handlers that have changed their handlers
			this.#clearSubscriptions();
			this.#writeEventHandlers();
		}

		updateState(state: any) {
			this.state = { ...this.state, ...state };
			this.patch();
		}

		patch() {
			if (!this.#vdom || !this.#isMounted)
				throw new Error("Component Not Mounted");
			const new_vdom = this.render();
			console.log('new_vdom', new_vdom);
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

		#writeEventHandlers() {
			this.#subscriptions = Object.entries(this.#eventHandlers).map(
				([eventName, handler]) => this.#writeEventHandler(eventName, handler)
			);
		}

		#writeEventHandler(commandName: string, handler: any) {
			return this.#dispatcher.subscribe(commandName, (payload: any) => {
				if (this.#parentComponent) handler.call(this.#parentComponent, payload);
				else handler.call(this, payload);
			});
		}
		emit(commandName: string, payload: any) {
			return this.#dispatcher.dispatch(commandName, payload);
		}
		mount(hostEl: any, index: number | null = null) {
			if (this.#isMounted) throw new Error("Component Already mounted");
			this.#vdom = this.render();
			mountDOM(this.#vdom, hostEl, index, this);
			this.#writeEventHandlers();
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
			this.#clearSubscriptions();
		}

		#clearSubscriptions() {
			this.#subscriptions.forEach((unsubscribe) => unsubscribe());
			this.#subscriptions = [];
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
