export class Dispatcher {
    #subs = new Map<string, any[]>()
    #afterHandlers: any[] = []


    subscribe(commandName: string, handler: any) {
        if (!this.#subs.has(commandName))
            this.#subs.set(commandName, [])
        const handlers = this.#subs.get(commandName) as any[];
        if (handlers.includes(handler))
            return () => {}
        handlers.push(handler);
        return () => {
            const idx = handlers.indexOf(handler);
            handlers.splice(idx, 1)
        }
    }

    afterEveryHandler(handler: any) {
        this.#afterHandlers.push(handler);
        return () => {
            const idx = this.#afterHandlers.indexOf(handler);
            this.#afterHandlers.splice(idx, 1)
        }
    }

    dispatch(commandName: string, payload: any) {
        if (this.#subs.has(commandName))
            this.#subs.get(commandName)?.forEach((handler) => handler(payload))
        else
            console.warn(`No handlers for command: ${commandName}`)
        this.#afterHandlers.forEach((handler) => handler())
    }
}