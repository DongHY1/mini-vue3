import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"
const reactiveGet = createGetter() //缓存
const reactiveSet = createSetter()
const readonlyGet = createGetter(true) 
function createGetter(isReadonly=false){
    return function get(target,key){
        if(key===ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }else if (key===ReactiveFlags.IS_READONLY){
            return isReadonly
        }
        const res = Reflect.get(target,key)
        if(!isReadonly){
            track(target,key)
        }
        return res
    }
}
function createSetter(){
    return function set(target,key,val){
        const res = Reflect.set(target,key,val)
        trigger(target,key)
        return res
    }
}
export const reactiveHandler = {
    get:reactiveGet,
    set:reactiveSet
}
export const readonlyHandler = {
    get:readonlyGet,
    set(target,key,values){
        console.warn(`${key}不可以set,因为${target}是readonly `)
        return true
    }
}