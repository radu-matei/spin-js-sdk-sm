//@ts-ignore
import * as spinKv from "fermyon:spin/key-value@2.0.0"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export interface Store {
    get: (key: string) => Uint8Array | null
    set: (key: string, value: Uint8Array | string | object) => void
    delete: (key: string) => void
    exists: (key: string) => boolean
    getKeys: () => string[]
    getJson: (key: string) => any
    setJson: (key: string, value: any) => void
}

function createKvStore(store: spinKv.store): Store {
    let kv = {
        get: (key: string) => {
            return store.get(key)
        },
        set: (key: string, value: Uint8Array | string | object) => {
            if (typeof (value) === "string") {
                value = encoder.encode(value)
            } else if (typeof (value) === "object") {
                value = encoder.encode(JSON.stringify(value))
            }
            store.set(key, value)
        },
        delete: (key: string) => {
            store.delete(key)
        },
        exists: (key: string) => {
            return store.exists(key)
        },
        getKeys: () => {
            return store.getKeys()
        },
        getJson: (key: string) => {
            return JSON.parse(decoder.decode(store.get(key) || new Uint8Array))
        },
        setJson: (key: string, value: any) => {
            store.set(key, encoder.encode(JSON.stringify(value)))
        }
    }
    return kv
}


export function open(label: string): Store {
    return createKvStore(spinKv.Store.open(label))
}
export function openDefault(): Store {
    return createKvStore(spinKv.Store.open("default"))
}
