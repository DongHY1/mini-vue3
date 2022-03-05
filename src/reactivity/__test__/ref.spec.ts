import {ref} from '../ref'
describe('ref',()=>{
    it('happy path',()=>{
        const res = ref(1)
        expect(res.value).toBe(1)
    })
})