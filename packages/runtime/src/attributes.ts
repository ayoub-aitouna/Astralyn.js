export function setAttributes(el: any, attrs: any) {
    const { class: className, style, ...otherAttrs } = attrs
    if (className)
        setClass(el, className)
    if (style)
        Object.entries(style).forEach(([prop, value]) => {
            setStyle(el, prop, value)
        })

    Object.entries(otherAttrs).forEach(([attr, value]) => {
        setAttribute(el, attr, value)
    });
}

export function setClass(el: any, className: any) {
    el.className = ''
    if (Array.isArray(className)) {
        el.classList.add(...className)
    } else {
        el.className = className
    }
}


export function setStyle(el: any, name: string, value: any) {
    el.style[name] = value
}

export function removeStyle(el: any, name: string, value: any) {
    el.style[name] = null
}


export function setAttribute(el: any, name: string, value: any) {
    if (value == null)
        removeAttribute(el, name)
    else if (name.startsWith('data-'))
        el.setAttribute(name, value)
    else
        el[name] = value
}

export function removeAttribute(el: any, name: string) {
    el[name] = null
    el.removeAttribute(name)
}