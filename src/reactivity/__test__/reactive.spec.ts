// reactive处理逻辑
import {reactive,isReactive,isProxy} from '../reactive'
describe('reactive', () => {
    it('Object',()=>{
        const original = { foo: 1 }
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        // get
        expect(observed.foo).toBe(1)
        // has
        expect('foo' in observed).toBe(true)
        // ownKeys
        expect(Object.keys(observed)).toEqual(['foo'])
        // isReactive 判断对象是否为响应式
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
        expect(isProxy(observed)).toBe(true)
    })
    test('nested object',()=>{
        const original = {
            nested:{
                foo:1
            },
            array:[{bar:2}]
        }
        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
});