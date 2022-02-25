import {reactive} from '../reactive'
import {effect,stop} from '../effect'
describe("effect", () => {

    it('happy path', () => {
        const user = reactive({
            age:10
        })
        let nextAge
        effect(()=>{
            nextAge = user.age+1
        })
        expect(nextAge).toBe(11)
        // 此处需要做依赖收集和依赖更新才能通过
        user.age++
        expect(nextAge).toBe(12)
    });
    it("call effect return run",()=>{
        let foo =10
        const run = effect(()=>{
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
        let run:any;
        // 定义一个jest函数
        const scheduler = jest.fn(() => {
          run = runner
        })
        // 创建一个响应式对象
        const obj = reactive({foo: 1})
        // 将effect的返回值也就是runner赋值给runner
        const runner = effect(() => {
          dummy = obj.foo
        }, {scheduler})
        // 这时候scheduler函数并未执行
        expect(scheduler).not.toHaveBeenCalled()
        // 默认执行了effect第一个参数fn，所以dummy为1
        expect(dummy).toBe(1)
        // 再次更新响应式对象的值
        obj.foo++;
        // 这时候执行的是scheduler，并未执行fn，所以dummy并不会同步更新
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
        obj.prop = 3
        expect(dummy).toBe(2)
    
        // stopped effect should still be manually callable
        runner()
        expect(dummy).toBe(3)
    })
    it('onStop', () => {
      const onStop = jest.fn()
      const runner = effect(() => {}, {
        onStop
      })
  
      stop(runner)
      expect(onStop).toHaveBeenCalled()
    })
});