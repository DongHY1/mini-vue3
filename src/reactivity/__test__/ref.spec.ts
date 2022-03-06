import {ref,isRef,unRef,proxyRefs} from '../ref'
import {effect} from '../effect'
import { reactive } from '../reactive'
describe('ref',()=>{
    it('happy path',()=>{
        const res = ref(1)
        expect(res.value).toBe(1)
    })
    it('should be reactive', () => {
        const a = ref(1)
        let dummy
        let calls = 0
        effect(() => {
          calls++
          dummy = a.value
        })
        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        // same value should not trigger
        a.value = 2
        expect(calls).toBe(2)
    })
    it('should make nested properties reactive', () => {
        const a = ref({
          count: 1
        })
        let dummy
        effect(() => {
          dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
      })
    it('isRef',()=>{
      const a = ref(1)
      const b = reactive({
        age:1
      })
      expect(isRef(a)).toBe(true)
      expect(isRef(2)).toBe(false)
      expect(isRef(b)).toBe(false)
    })
    it('unRef',()=>{
      const a = ref(1)
      expect(unRef(a)).toBe(1)
      expect(unRef(2)).toBe(2)
    })
    it("proxyRefs",()=>{
      const obj = {
        age:ref(10),
        name:'kobe'
      }
      // 我们在<script setup></script>中定义的ref,到了<template>中无需.value来获取值
      // 这是因为内部帮我们进行了proxyRefs转换
      // 如果key 对应的值是ref,那么就通过.value返回,如果不是，则直接返回值
      const proxyObj = proxyRefs(obj)
      expect(proxyObj.age).toBe(10)
      expect(obj.age.value).toBe(10)
      // set的话，要判断set的值是不是一个ref类型
      // 如果是，则直接替换；如果不是，通过.value形式替换
      proxyObj.age = ref(20)
      expect(proxyObj.age).toBe(20)
      expect(obj.age.value).toBe(20)
      proxyObj.name = 'david'
      expect(proxyObj.name).toBe('david')
      expect(obj.name).toBe('david')
    })
})