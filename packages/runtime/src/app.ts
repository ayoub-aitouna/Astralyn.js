import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
import { VDOM_TYPE } from "./h";
import { mountDOM } from "./mount-dom";
import { patchDOM } from './patch-dom'

type AppInstanceType = {
    state: any,
    view: (state: any, emit: (eventName: string, payload: any) => void) => VDOM_TYPE,
    reducers: any
}


export function createApp({ state, view, reducers = {} }: AppInstanceType) {

    let parentEl: any = null;
    let vdom: VDOM_TYPE | null = null;
    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryHandler(renderApp)]

    function emit(eventName: string, payload: any) {
        dispatcher.dispatch(eventName, payload)
    }

    for (const actinName in reducers) {
        const reducer = reducers[actinName]
        const subs = dispatcher.subscribe(actinName, (payload: any) => {
            state = reducer(state, payload)
        })
        subscriptions.push(subs);
    }

    function renderApp() {
        if (vdom)
            destroyDOM(vdom)
        const new_vdom = view(state, emit)
        vdom = patchDOM(vdom, new_vdom, parentEl)
    }

    return {
        mount(_parentEl: any) {
            if (vdom)
                throw new Error('This Application Already Mounted')
            parentEl = _parentEl
            vdom = view(state, emit)
            mountDOM(vdom, vdom)
        },
        unmount() {
            if (vdom)
                destroyDOM(vdom)
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe())
        }
    }
}