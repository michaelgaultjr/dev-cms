import { Cache } from "./interfaces.ts";

export default class RecordCache<TKey extends string | number | symbol, TValue> implements Cache<TKey, TValue> {

    storage: Record<TKey, Expirable<TValue>>;
    expires: number;
    
    /**  
     * @param expires The number of time in miliseconds each item is valid for.
    */
    constructor(expires?: number) {
        this.storage = {} as Record<TKey, Expirable<TValue>>;
        this.expires = expires ?? 300000;
    }

    get(key: TKey): Promise<TValue> {
        return Promise.resolve(this.storage[key].item)
    }
    set(key: TKey, value: TValue): Promise<void> {
        this.storage[key] = new Expirable<TValue>(Date.now(), value);
        return Promise.resolve();
    }

    exists(key: TKey): Promise<boolean> {
        const expirable = this.storage[key];

        if (expirable && (Date.now() - expirable.time) > this.expires) {
            delete this.storage[key];
            return Promise.resolve(false);
        }
        
        return Promise.resolve(expirable != undefined)
    }
    
    remove(key: TKey): Promise<void> {
        delete this.storage[key];
        return Promise.resolve();
    }

    clear(): Promise<void> {
        this.storage = {} as Record<TKey, Expirable<TValue>>;
        return Promise.resolve();
    }

}

class Expirable<T> {
    time: number;
    item: T;

    constructor (time: number, item: T) {
        this.item = item;
        this.time = time;
    }
}