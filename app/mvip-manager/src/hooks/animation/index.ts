import React, { useState, useEffect, useRef } from 'react'

type AnimationFrameCallBack = (frameTime: number, stop: any) => void

/**
 * 用于计算两个帧率之间的时差
 * @param callback 用于承接时差的回调函数
 */
export const useAnimationFrame = (callback: AnimationFrameCallBack) => {

  // 使用 useRef 保证重渲染时不丢失数据
  const requestRef = useRef<number | null>()
  const frameTimeRef = useRef<number>()

  // 手动停止空循环可以提高页面性能
  const stopAnimationFrame = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = null
    }
  }

  const run = (time: any) => {
    if (frameTimeRef.current) {
      const deltaTime = time - frameTimeRef.current
      // 当线程阻塞时暂停动画
      if (deltaTime < (1000 / 60 * 6)) {
        callback(deltaTime, stopAnimationFrame)
      }
    }
    frameTimeRef.current = time
    if (requestRef.current) {
      requestRef.current = requestAnimationFrame(run)
    }
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(run)
    // console.log('requestRef.current: ', requestRef.current)
    return stopAnimationFrame
  }, [])
}

// 缓动动画
const tween = {
  linear(t: number, b: number, c: number, d: number) {
    return (c * t) / d + b
  },
  easein(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t + b
  },
}

/* 获取动画的步进数值 */
interface useAnimationParams {
  from: number
  to: number
  time: number
  type?: any
  callback: (nextVal: number, stop: any) => void
}
export const useAnimation = ({
  from,
  to,
  time,
  type = tween.easein,
  callback
}: useAnimationParams) => {

  // TODO refactor 一堆 Ref 看起来很难看，肯定有更好的写法

  // 总动画耗时
  const consumedTimeRef = useRef(0)
  const fromRef = useRef(from)
  const toRef = useRef(to)
  const timeRef = useRef(time)
  // 确保返回的结果不能超出范围
  const safeRef = useRef((num: number) => (num > to ? to : num))

  useEffect(() => {
    consumedTimeRef.current = 0
    toRef.current = to
    safeRef.current = (num: number) => (num > toRef.current ? toRef.current : num)
  }, [to])

  useAnimationFrame((frameTime: number, stop: any) => {
    consumedTimeRef.current += frameTime
    const targetVal = ~~type(consumedTimeRef.current, fromRef.current, toRef.current, timeRef.current)
    const nextVal = consumedTimeRef.current < timeRef.current ? targetVal : safeRef.current(targetVal)

    // TODO refactor 向外暴露API；更改默认行为
    const shouldStop = nextVal === toRef.current && fromRef.current !== toRef.current

    shouldStop && stop && stop()

    callback(nextVal, stop)
  })
}
