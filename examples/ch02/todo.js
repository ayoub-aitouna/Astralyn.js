

const todos = ['walk the dog', 'clean my room', 'make launch']

const todo_list = document.getElementById('todo-list')
const todo_input = document.getElementById('todo-input')
const todo_btn = document.getElementById('todo-btn')

for (const todo of todos) {
    todo_list.append(renderReadMode(todo))
}


todo_input.addEventListener('input', () => {
    todo_btn.disabled = todo_input.value.length <= 3;
})

todo_input.addEventListener('keydown', ({ key }) => {
    if (key == 'Enter' && todo_input.value.length >= 3)
        add_todo();
})

todo_btn.addEventListener('click', () => add_todo())



function add_todo() {
    todos.push(todo_input.value)
    todo_list.append(renderReadMode(todo_input.value))
    todo_input.value = ''
    todo_btn.disabled = true
}


function renderReadMode(item) {
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.innerText = item
    span.addEventListener('dblclick', () => {
        const id = todos.indexOf(item)
        console.log('id', id)
        todo_list.replaceChild(
            renderEditMode(item),
            todo_list.childNodes[id]
        )
    })
    li.append(span)

    li.append(Btn('DONE', 'todo-done', () => {
        const id = todos.indexOf(item)
        todos.splice(id, 1)
        todo_list.childNodes[id].remove()
    }))

    return li
}



function renderEditMode(item) {

    const li = document.createElement('li')
    const input = document.createElement('input')
    input.value = item
    li.append(input)

    li.append(Btn('Save', 'todo-save', () => {
        const id = todos.indexOf(item)

        if (input.value.length >= 3)
            todos[id] = input.value

        todo_list.replaceChild(
            renderReadMode(todos[id]),
            todo_list.childNodes[id]
        )
    }))

    li.append(Btn('Cancel', 'todo-cacel', () => {
        const id = todos.indexOf(item)

        todo_list.replaceChild(
            renderReadMode(item),
            todo_list.childNodes[id]
        )
    }))

    return li
}


function Btn(name, id, callback) {
    const button = document.createElement('button')
    button.id = id
    button.innerText = name
    button.addEventListener('click', () => callback())
    return button
}