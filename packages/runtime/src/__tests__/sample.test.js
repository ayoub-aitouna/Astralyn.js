import { expect, test } from 'vitest'
import { objectDiff } from '../utils/objects'
test('ObjectDiff test 1', () => {
    const oldObj = { type: 'number', disabled: false, max: 999 }
    const newObj = { type: 'number', disabled: true, min: 0 }

    expect(objectDiff(oldObj, newObj)).toStrictEqual({ added: ['min'], removed: ['max'], updated: ['disabled'] })
})


test('ObjectDiff test 1', () => {
    const oldObj = {
        type: 'element',
        tag: 'h1',
        props: { on: { click: () => { } } },
        value: 'Hello',
    }
    const newObj = {
        type: 'element',
        tag: 'p',
        value: 'World!',
    }

    expect(objectDiff(oldObj, newObj)).toStrictEqual({ added: [], removed: ['props'], updated: ['tag', 'value'] })
})
