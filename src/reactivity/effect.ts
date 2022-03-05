import {extend} from '../shared'
let activeEffect; //activeEffect记录当前函数执行状态，实例对象调用run()的时候会被设置为当前方法
let shouldTrack;//如果调用了stop(),shouldTrack =false
class ReactiveEffect {
    private _fn: any
    deps = []
    active = true //频繁清空影响性能，采用active来判断是否已经清空过
    onStop?:()=>void
    constructor(fn, public scheduler?) {
        this._fn = fn
    }
    run() {
        // active为true,代表没执行stop
        if(!this.active){
            return this._fn()
        }
        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        shouldTrack = false
        return result
    }
    stop() {
        //dep是set结构
        if (this.active) {
            clearEffect(this)
            if(this.onStop){
                this.onStop()
            }
            this.active=false
        }

    }
}
function clearEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
}
const targetMap = new Map()
export function track(target, key) {
    if (!activeEffect) return
    if(!shouldTrack) return
    // 使用Set数据结构，防止重复传入相同的执行函数
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    // 将执行函数添加到dep
    if(dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
} 
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

export function effect(fn, options: any = {}) {
    // 收集用户传过来的执行函数，交给实例对象
    const _effect = new ReactiveEffect(fn, options.scheduler)
    // _effect.onStop = options.onStop -> Object.assign(_effect,options) ->extend(_effect,options)
    extend(_effect,options)
    _effect.run() //赋值activeEffect为this
    // 使用bind，将this绑定到当前实例上。
    const runner: any = _effect.run.bind(_effect)
    // 为了stop操作->拿到实例对象
    runner.effect = _effect
    return runner
}
export function stop(runner) {
    runner.effect.stop()
    shouldTrack = false
}