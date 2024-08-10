import { createApp, h, hFragment } from 'https://unpkg.com/astralyn@1'




const component = (state, emit) => {
    return hFragment([
        h('button', {
            on: {
                click: () => {
                    emit('decrement-counter', 1)
                }
            }
        }, ['-']),
        h('span', {}, [`counter is ${state}`]),
        h('button', {
            on: {
                click: () => {
                    emit('increment-counter', 1)
                }
            }
        }, ['+']),
        h('div', {}, [

            h(
                'a',
                {
                    href: 'https://en.wikipedia.org/wiki/Doge_(meme)',
                },
                ['Doge!'],
            ),
        ])
    ])
}

const AppInstance = createApp({
    state: 0,
    view: component,
    reducers: {
        'increment-counter': (state, payload) => state + payload,
        'decrement-counter': (state, payload) => state - payload > 0 ? state - payload : 0
    }
})

AppInstance.mount(document.body)