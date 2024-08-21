import { VDOM_TYPE } from "../h";

type PropsAndEvents = {
	props: any;
	events: any| null;
};

export function extractPropsAndEvents(vdom: VDOM_TYPE): PropsAndEvents {
	const { on: events = {}, ...props } = vdom.props || {};
	return { props, events };
}
