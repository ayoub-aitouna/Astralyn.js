export class Dispatcher {
    #subs = new Map()
    #afterHandlers : any[] = []

    afterEveryHandler(handler: any)
    {
        this.#afterHandlers.push(handler);
    }
    subscribe(commandName: string, handler: any) {
        if (!this.#subs.has(commandName))
            this.#subs.set(commandName, [])
        const handlers = this.#subs.get(commandName) as Array<any>;
        if (handler.includes(handler))
            return () => { }
        handlers.push(handler);
        return () => {
            const idx = handlers.indexOf(handler);
            handlers.splice(idx, 1)
        }
    }
}