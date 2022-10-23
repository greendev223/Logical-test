import { useState, useEffect } from 'react'

export type TApiResponse = {
  data: any
  error: any
  loading: Boolean
  setUrl: Function
}

export const useApiGet = (endpoint?: string): TApiResponse => {
  const [url, setUrl] = useState<string>(endpoint || '')
  const [data, setData] = useState<any>()
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getAPIData = async () => {
    setLoading(true)
    try {
      const apiResponse = await fetch(url)
      const json = await apiResponse.json()
      setData(json)
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (url) {
      console.log(url)
      getAPIData()
    }
  }, [url])

  return { data, error, loading, setUrl }
}
