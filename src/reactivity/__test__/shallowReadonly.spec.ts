import {isReadonly, shallowReadonly} from '../reactive'
describe("readonly",()=>{
    it('should make nested values readonly', () => {
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = shallowReadonly(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(wrapped.bar)).toBe(false)
    })
})
