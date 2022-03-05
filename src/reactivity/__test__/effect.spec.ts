import { reactive } from '../reactive'
import { effect, stop } from '../effect'
describe("effect", () => {
  it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))
    expect(dummy).toBe(0)
    counter.num = 7 
    expect(dummy).toBe(7)
  })
  it("call effect return run", () => {
    let foo = 10
    const run = effect(() => {
      foo++
      return "foo"
    })
    expect(foo).toBe(11)
    const r = run()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })
  it("scheduler", () => {
    let dummy;
    let run: any;
    // 调度器接受一个函数
    const scheduler = jest.fn(() => {
      run = runner
    })
    // 创建一个响应式对象
    const obj = reactive({ foo: 1 })
    // 将effect的返回值也就是runner赋值给runner
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    // 这时候scheduler函数一开始不会被调用
    expect(scheduler).not.toHaveBeenCalled()
    // 默认执行了effect第一个参数fn，所以dummy为1
    expect(dummy).toBe(1)
    // 再次更新响应式对象的值
    obj.foo++;
    // 这时候执行的是scheduler，并未执行effect的第一个参数，所以dummy并不会同步更新
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    // 执行run()的时候便是执行上面的fn函数，这在上一节有讲到
    run()
    // 这时候dummy的值才会更新
    expect(dummy).toBe(2)
  })
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
  it('onStop', () => {
    // 用户调用stop之后，onstop这个函数会被执行
    const onStop = jest.fn()
    const runner = effect(() => { }, {
      onStop
    })

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
});