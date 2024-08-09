import { h } from "./h";
import { mountDOM } from "./mount-dom";

const vdom = h('section', {}, [
    h('h1', {}, ['My Blog']),
    h('p', {}, ['Welcome to my blog!'])
])
mountDOM(vdom, document.body);