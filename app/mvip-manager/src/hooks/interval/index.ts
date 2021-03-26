import React, { useState, useEffect, useRef } from 'react'

export const useInterval = (callback: () => any, delay: number) => {
  const saveCallback = useRef<() => any>();
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  useEffect(() => {
    // 每次渲染后，保存新的回调到我们的 ref 里
    saveCallback.current = callback;
  })

  useEffect(() => {
    function tick() {
      saveCallback.current!();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      setTimer(id)
      return () => {
        if (timer) {
          clearInterval(timer);
        }
      }
    }
  }, [delay]);

  return timer!
};