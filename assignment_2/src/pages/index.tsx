import React, { useEffect, useRef, useState } from 'react'

import { NextPage } from 'next'
import { useApiGet } from '@src/hooks/useFetch'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import AnalyzedTableContent from '@src/components/AnalyzedTableContent'
import { ANALYZE_API, DEFAULT_IMG_URL } from '../constants/analyzeValues'

/**
 * Home page to analyze image...  2022-10-23 by Jovan
 * @returns
 */

const Home: NextPage = () => {
  //the hook to fetch the analyzed data by Endpoint
  const { data, error, loading, setUrl } = useApiGet()
  const [analyzedData, setAnalyzedData] = useState<any[]>([])

  //to save history in localstorage
  const [isShowHistory, setIsShowHistory] = useState<boolean>(false)
  const [history, setHistory] = useState<any>(null)
  const [historyIndex, setHistoryIndex] = useState<number>(0)

  const url_ref = useRef<HTMLInputElement>(null)

  const notify = (text: string) => toast(text)

  //when get response from data, change analyzedData state...
  useEffect(() => {
    if (data) {
      setAnalyzedData(data)
      notify('Analyzing is finished')
    }
    setHistory(getHistory())
  }, [data])

  //get history in local storage with a key - 'analyzed_history'
  const getHistory = () => {
    let oldHistory: any = localStorage.getItem('analyzed_history')
    return JSON.parse(oldHistory) || null
  }

  // send request to server with the endpoint
  const handleAnalyze = () => {
    if (url_ref.current?.value) {
      setUrl(ANALYZE_API + url_ref.current?.value)
      setIsShowHistory(false)
    } else notify('Please input image Url to analyze')
  }

  //toggle show/hide history mode...
  const toggleHistory = () => {
    setIsShowHistory((v) => !v)
  }

  //save current analyzed data to local storage
  const savedata = () => {
    if (data) {
      notify('Successly saved')
      let key: string = url_ref.current?.value || ''
      const newData: any = { [key]: analyzedData }

      let newHistory = { ...getHistory(), ...newData }

      localStorage.setItem('analyzed_history', JSON.stringify(newHistory))
      setHistory(newHistory)
      setIsShowHistory(true)
    } else notify('No exist data anlasyzed to save')
  }

  //get all images stored in local storage
  const getHistoryImages = (): string[] => {
    if (history) return Object.keys(history)
    else return []
  }

  //clear history
  const clearHistory = () => {
    localStorage.removeItem('analyzed_history')
    notify('History is cleared')
    setHistory(null)
  }

  //get data to show in table. it's related with the  toggle button  for 'show/hide history'
  const getShowingData = () => {
    let returnData = []

    //if showing hostory mode
    if (isShowHistory) {
      if (history) returnData = history[getHistoryImages()[historyIndex]]
    } else returnData = analyzedData
    return returnData || []
  }

  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='max-w-[100%] md:max-w-[768px] mx-auto flex flex-col gap-8 justify-center py-20 px-10 '>
        {/* title */}
        <p className='flex text-4xl justify-center'>Image Analyzing App</p>

        <div className='flex justify-center flex-col gap-4 w-fll'>
          <div className='flex gap-5'>
            {/* image url input */}
            <input
              type='text'
              ref={url_ref}
              defaultValue={DEFAULT_IMG_URL}
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Please input img url...   http://aa/bb.jpg '
              required
            />

            {/* handle analyzing button */}
            <button
              type='submit'
              onClick={handleAnalyze}
              className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
              Analyze
            </button>
          </div>

          <div className='  p-6 max-w-sm bg-white rounded-lg border min-h-[100% - 0px] flex flex-col gap-5 border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 min-w-full'>
            <div className='flex justify-between text-xl'>
              <div>{!isShowHistory ? 'Analyzed Information' : 'Analyzed History'}</div>

              {/* toggle button  for show/hide history */}
              <div className='flex items-center gap-2'>
                <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Show hidtory</span>
                <label htmlFor='checked-toggle' className='inline-flex relative items-center cursor-pointer'>
                  <div
                    onClick={toggleHistory}
                    className={`${isShowHistory ? 'bg-blue-700 after:left-[23px] ' : 'bg-gray-200  after:left-[0px] '}
                    w-11 h-6  rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
                </label>
              </div>
            </div>

            {/* images list in show-history mode */}
            <div className='overflow-x-auto '>
              {isShowHistory && history && (
                <div className='flex gap-5 h-[150px] w-full overflow-x-auto overflow-y-hidden mb-8'>
                  {getHistoryImages().map((img_url, index: number) => (
                    <img
                      key={index}
                      src={img_url}
                      onClick={() => {
                        setHistoryIndex(index)
                      }}
                      className={
                        'h-full w-auto border-4 rounded-md cursor-pointer hover:border-indigo-600 ' +
                        (historyIndex == index ? 'border-indigo-600' : '')
                      }
                    />
                  ))}
                </div>
              )}

              {/* analyzing table */}
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='py-3 px-2'>
                      ID
                    </th>

                    <th scope='col' className='py-3 '>
                      Description
                    </th>
                    <th scope='col' className='py-3 px-4'>
                      Score
                    </th>
                    <th scope='col' className='py-3 pl-4'>
                      Topicality
                    </th>
                  </tr>
                </thead>
                {(!loading || isShowHistory) && <AnalyzedTableContent data={getShowingData()} />}
              </table>

              {/* loading bar */}
              {loading && (
                <div role='status' className='flex justify-center items-center m-3 gap-1'>
                  <svg
                    className='inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                  <span>Loading...</span>
                </div>
              )}

              {/* handling error */}
              {!loading && !isShowHistory && (
                <div>
                  {(!data || (data && data.length == 0)) && (
                    <div className='p-4 text-lg text-center'>No Analyzed Result...</div>
                  )}
                  {error && <div className='p-4 text-md'>{JSON.stringify(error)}</div>}
                </div>
              )}
              {isShowHistory && (!history || (history && getShowingData().length == 0)) && (
                <div className='p-4 text-lg text-center'>No History Data...</div>
              )}
            </div>

            {/* Save and clear history buttons */}
            <div className='flex justify-end'>
              {!isShowHistory ? (
                <button
                  onClick={savedata}
                  className='text-white bg-green-700	 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                  Save Data
                </button>
              ) : (
                <button
                  onClick={clearHistory}
                  className='text-white bg-yellow-600	 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                  Clear History
                </button>
              )}
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
