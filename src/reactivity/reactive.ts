import { reactiveHandler, readonlyHandler } from "./baseHandlers"
export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY="__v_isReadonly"
}
export function reactive(obj){
    return createActiveObject(obj,reactiveHandler)
}
export function readonly(obj){
    return createActiveObject(obj,readonlyHandler)
}
export function isReactive(obj){
    return !!obj[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(obj){
    return !!obj[ReactiveFlags.IS_READONLY]
}
function createActiveObject(obj:any,baseHandler){
    return new Proxy(obj,baseHandler)
}