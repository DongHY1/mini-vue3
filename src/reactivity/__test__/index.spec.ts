// 检测 测试环境搭建的有没有问题
// jest 运行在node环境使用的是CommonJS规范，使用import需要通过babel转换
// https://jestjs.io/zh-Hans/docs/getting-started
import {add} from '../index'
it("init",()=>{
    expect(add(1,1)).toBe(2);
})