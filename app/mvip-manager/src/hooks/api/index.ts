import { useState, useEffect } from 'react'
import { errorMessage } from '@/components/message'

export function useApi(defaultValue: any = null, requestApiFunc: Function, params: any = null) {
  const [ ret, setRet ] = useState<any | null>(defaultValue)
  const [ loading, setLoading ] = useState<boolean>(false)

  const reqData = async (reqParams: any) => {
    setLoading(true)
    const ret = await requestApiFunc(reqParams)
    setLoading(false)
    const isSuccess = ret && (ret.success || ret.code === 0)
    const message = ret && ret.message
    const data = ret && ret.data
    if (isSuccess) {
      setRet(data)
    } else {
      errorMessage(message)
    }
    return data
  }

  useEffect(() => { reqData(params) }, [])

  return [ ret, loading, reqData ]
}
