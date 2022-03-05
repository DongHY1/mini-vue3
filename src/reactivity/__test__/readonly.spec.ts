import {readonly,isReadonly} from '../reactive'
describe("readonly",()=>{
    it('should make nested values readonly', () => {
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(original)).toBe(false)
    })
    it('调用readonly set时,发出警告',()=>{
      // mock 模拟控制台报错
      console.warn = jest.fn()
      const user = readonly({
        age:10
      })
      user.age =11
      expect(console.warn).toBeCalled();
    })
})