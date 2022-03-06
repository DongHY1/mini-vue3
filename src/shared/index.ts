export const extend = Object.assign
export function isObject(obj){
    return typeof obj === 'object' && obj!==null
}
export function hasChange(oldValue,newValue){
    return !Object.is(oldValue,newValue)
} 