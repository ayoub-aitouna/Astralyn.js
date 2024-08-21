import { destroyDOM } from "./destroy-dom";
import { h, VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";

export function createApp(RootComponent: any, props: any) {
	let parentEl: any = null;
	let vdom: VDOM_TYPE | null = null;
	let isMounted = false;

	function reset() {
		parentEl = null;
		vdom = null;
		isMounted = false;
	}

	return {
		mount(_parentEl: any) {
			if (isMounted)
				throw new Error("This Application Already Mounted");
			parentEl = _parentEl;
			vdom = h(RootComponent, props);
			mountDOM(vdom, parentEl);
			isMounted = true;
			return this;
		},
		unmount() {
			if (!isMounted) throw new Error("This Application is not mounted");
			if (vdom) destroyDOM(vdom);
			reset();
		},
	};
}
