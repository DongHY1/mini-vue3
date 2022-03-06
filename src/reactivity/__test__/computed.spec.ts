import { reactive } from "../reactive"
import { computed } from "../computed"
describe("computed", () => {
    it('happy path', () => {
        const user = reactive({
            age: 1
        })
        const age = computed(() => {
            return user.age
        })
        expect(age.value).toBe(1)
    })
    it.skip('cache', () => {
        //缓存功能
    })
})