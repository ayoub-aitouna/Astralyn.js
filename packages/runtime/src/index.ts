import { h, hFragment } from "./h";
import { mountDOM } from "./mount-dom";
import { destroyDOM } from "./destroy-dom";


const vdom = h('section', {}, [
    h('h1', {}, ['My Blog']),
    h('p', {
        on: {
            click: onclick
        }
    }, ['Welcome to my blog!'])
]);

function onclick() {
    destroyDOM(vdom)
}
const section = hFragment([
    h('h2', {}, ['Very important news']),
    h('p', {}, ['such news, many importance, too fresh, wow']),
    h(
        'a',
        {
            href: 'https://en.wikipedia.org/wiki/Doge_(meme)',
        },
        ['Doge!'],
    ),
])
console.log(section);
mountDOM(section, document.body);
