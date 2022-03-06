import { trackEffects, triggerEffects, isTracking } from './effect'
import { hasChange, isObject } from '../shared'
import { reactive } from './reactive'
class refImpl {
    private _value: any
    public dep
    private _rawValue:any
    public __v_isRef=true
    constructor(value) {
        this._rawValue = value
        // nested object 判断传入的是否是对象
        this._value = convert(value)
        this.dep = new Set()
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.dep)
        }
        return this._value
    }
    set value(newValue) {
        if (hasChange(this._rawValue, newValue)) {
            this._rawValue = newValue
            this._value = convert(newValue)
            triggerEffects(this.dep)
        }
    }
}
function convert(value){
    return isObject(value)?reactive(value):value
}
export function ref(value) {
    return new refImpl(value)
}
export function isRef(ref){
    return !!ref.__v_isRef
}
export function unRef(ref){
  return isRef(ref)? ref.value:ref
}