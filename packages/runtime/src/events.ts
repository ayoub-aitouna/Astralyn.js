export function addEventListeners(events: any, element: any) {
    const addedListeners: any = {}
    if (!events)
        return addedListeners
    Object.entries(events).forEach(([eventName, handler]) => {
        const eventHandler = addEventListener(eventName, handler, element)
        addedListeners[eventName] = eventHandler
    })
    return addedListeners;
}

export function removeEventListeners(events: any, element: any) {
    if (!events)
        return;
    Object.entries(events).forEach(([eventName, handler]) => {
        element.removeEventListener(eventName, handler)
    })
}

export function addEventListener(eventName: any, handler: any, el: any) {
    el.addEventListener(eventName, handler)
    return handler
}