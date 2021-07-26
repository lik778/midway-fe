import { useState, useEffect } from 'react'
import { errorMessage } from '@/components/message'
import { ServiceResponse } from '@/interfaces/api'

export function useApi<DefaultValue = null, Params = null>(defaultValue: DefaultValue, requestApiFunc: Function, params?: Params) {
  const [ ret, setRet ] = useState<any | null>(defaultValue)
  const [ loading, setLoading ] = useState<boolean>(false)

  const request = async (reqParams?: Params) => {
    setLoading(true)
    let returnData = null
    try {
      const ret: ServiceResponse<DefaultValue> = await requestApiFunc(reqParams)
      const isSuccess = ret && (ret.success || ret.code === 0)
      const isFailed = ret && (ret.success === false || /50[0-9]/.test(String(ret.code)))
      const message = ret && ret.message || '未知错误'
      returnData = ret && ret.data

      if (isSuccess) {
        setRet(returnData)
      }
      if (isFailed) {
        errorMessage(message)
      }
    } finally {
      setLoading(false)
      return returnData
    }
  }

  useEffect(() => { request(params) }, [])

  return [ ret, loading, request ] as const
}
