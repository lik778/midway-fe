import { useState, useEffect } from 'react'
import { errorMessage } from '@/components/message'
import { ServiceResponse } from '@/interfaces/api'

export function useApi<DefaultValue = null, Params = null>(defaultValue: DefaultValue, requestApiFunc: Function, params?: Params) {
  const [ ret, setRet ] = useState<any | null>(defaultValue)
  const [ loading, setLoading ] = useState<boolean>(false)

  const request = async (reqParams?: Params) => {
    setLoading(true)
    const ret: ServiceResponse<DefaultValue> = await requestApiFunc(reqParams)
    const isSuccess = ret && (ret.success || ret.code === 0)
    const message = ret && ret.message || '未知错误'
    const data = ret && ret.data

    if (isSuccess) {
      setRet(data)
    } else {
      errorMessage(message)
    }

    setLoading(false)
    return data
  }

  useEffect(() => { request(params) }, [])

  return [ ret, loading, request ] as const
}
