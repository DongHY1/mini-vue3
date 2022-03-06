class computedRefImpl{
    private _getter:any
    constructor(getter){
        this._getter = getter
    }
    get value(){
        return this._getter()
    }
}
export function computed(getter){
    return new computedRefImpl(getter)
}