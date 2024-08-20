export function addEventListeners(
	events: any,
	element: any,
	hostComponent: any = null
) {
	const addedListeners: any = {};
	if (!events) return addedListeners;
	Object.entries(events).forEach(([eventName, handler]) => {
		const eventHandler = addEventListener(
			eventName,
			handler,
			element,
			hostComponent
		);
		addedListeners[eventName] = eventHandler;
	});
	return addedListeners;
}

export function removeEventListeners(events: any, element: any) {
	if (!events) return;
	Object.entries(events).forEach(([eventName, handler]) => {
		element.removeEventListener(eventName, handler);
	});
}

export function addEventListener(
	eventName: any,
	handler: any,
	el: any,
	hostComponent: any = null
) {
	function boundHandler(event: any) {
		hostComponent ? handler.apply(hostComponent, event) : handler(event);
	}
	el.addEventListener(eventName, boundHandler);
	return boundHandler;
}
