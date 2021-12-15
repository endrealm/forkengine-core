type EventMap = {
    [id: string]: Callback<any>[] | undefined
}

type Callback<T> = (params: T) => any;

export type Event<T> = {
    id: string
}

export class EventManager {
    private readonly eventMap: EventMap = {}

    public register<T>(event: Event<T>, callback: Callback<T>) {
        if(!this.eventMap[event.id]) {
            this.eventMap[event.id] = []
        }
        this.eventMap[event.id]!.push(callback)
    }

    public unregister<T>(event: Event<T>, callback: Callback<T>) {
        const list = this.eventMap[event.id];

        if(!list) {
            return
        }
        const index = list.indexOf(callback)
        if(index === -1) {
            console.warn(`Attempted to remove a callback from event '${event.id}' that isn't added`)
            return;
        }
        list.splice(index, 1);
    }


    public emit<T>(event: Event<T>, value: T) {
        if(!this.eventMap[event.id]) {
            return
        }
        this.eventMap[event.id]!.forEach(callback => {
            callback(value)
        })
    }
}
