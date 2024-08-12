import { createApp, h, hFragment } from 'https://unpkg.com/astralyn@1'
const state = {
    currentTodo: '',
    edit: {
        idx: null,
        original: '',
        edited: ''
    },
    todos: ['Walk the dog', 'Water the plants'],
}

const reducers = {

    'update-current-todo': (state, payload) => (
        {
            ...state,
            currentTodo: payload
        }
    ),
    'add-todo': (state, payload) => (
        {
            ...state,
            todos: [...state.todos, payload]
        }
    ),
    'start-editing-todo': (state, payload) => (
        {
            ...state,
            edit: {
                idx: payload,
                original: state.todos[payload],
                edited: state.todos[payload]
            }
        }
    ),
    'edit-todo': (state, edited) => ({
        ...state,
        edit: { ...state.edit, edited },
    }),
    'save-edited-todo': (state) => {
        const todos = [...state.todos]
        todos[state.edit.idx] = state.edit.edited
        return {
            ...state,
            edit: { idx: null, original: null, edited: null },
            todos,
        }
    },
    'cancel-editing-todo': (state) => ({
        ...state,
        edit: { idx: null, original: null, edited: null },
    }),
    'remove-todo': (state, idx) => ({
        ...state,
        todos: state.todos.filter((_, i) => i !== idx),
    }),
}


function CreateTodo({ currentTodo }, emit) {
    return h('div', {}, [
        h('label', { for: 'todo-input' }, ['New TODO']),
        h('input', {
            type: 'text',
            id: 'todo-input',
            value: currentTodo,
            on: {
                input: ({ target }) =>
                    emit('update-current-todo', target.value),
                keydown: ({ key }) => {
                    if (key === 'Enter' && currentTodo.length >= 3) {
                        emit('add-todo')
                    }
                },
            },
        }),
        h(
            'button',
            {
                disabled: currentTodo.length < 3,
                on: { click: () => emit('add-todo') },
            },
            ['Add']
        ),
    ])
}

function TodoList({ todos, edit }, emit) {
    return h(
        'ul',
        {},
        todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
    )
}

function TodoItem({ todo, i, edit }, emit) {
    const isEditing = edit.idx === i
    return isEditing
        ? h('li', {}, [
            h('input', {
                value: edit.edited,
                on: {
                    input: ({ target }) => emit('edit-todo', target.value)
                },
            }),
            h(
                'button',
                {
                    on: {
                        click: () => emit('save-edited-todo')
                    }
                },
                ['Save']
            ),
            h(
                'button',
                {
                    on: {
                        click: () => emit('cancel-editing-todo')
                    }
                },
                ['Cancel']
            ),
        ])
        : h('li', {}, [
            h(
                'span',
                {
                    on: {
                        dblclick: () => emit('start-editing-todo', i)
                    }
                },
                [todo]
            ),
            h(
                'button',
                {
                    on: {
                        click: () => emit('remove-todo', i)
                    }
                },
                ['Done']
            ),
        ])
}

function App(state, emit) {
    return hFragment([
        CreateTodo(state, emit),
        TodoList(state, emit),
    ])
}

const AppInstance = createApp({
    state: state,
    view: App,
    reducers: reducers
})

AppInstance.mount(document.getElementById('app'))