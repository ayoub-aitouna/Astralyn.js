import { h } from "./h";
import { mountDOM } from "./mount-dom";
const vDom = h('form', { class: 'login-form', action: 'login' }, [
    h('input', { type: 'text', name: 'user' }),
    h('input', { type: 'password', name: 'pass' }),
    h('button', { on: { click: () => { } } }, ['Login'])
])

mountDOM(vDom, document.body);