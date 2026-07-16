export function reactiveStore(target){
    let subscribed = new Map();
    const store = new Proxy({
        ...target,
        subscribe(key, callback) {
            if (!subscribed.has(key)){
                subscribed.set(key, [])
            }

            subscribed.get(key).push(callback)
        }, 
    },
    {
        set(target, key, newValue, receiver) {
            const result = Reflect.set(target, key, newValue)

            if (subscribed.has(key)){
                subscribed.get(key).forEach(cb => cb(receiver, key, receiver[key]))
            }
            
            return result;
        }
    })

    return store
}

export const SVG_NS = "http://www.w3.org/2000/svg";

export const INPUT_MODES = {
    HAND: "hand",
    RECT: "rect",
    ELLIPSE: "ellipse"
}