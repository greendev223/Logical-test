/**
 * Analyzed Table Content... 2022-10-23  by jovan
 * @param data any[]
 * @returns table contents that is including Analyzed data.
 */

interface AnalyzedTableContentType {
  data: any[]
}

const AnalyzedTableContent = ({ data }: AnalyzedTableContentType) => {
  return (
    <tbody>
      {data.map((item: any, index: number) => (
        <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
          <td className='py-4 px-2'>{index + 1}</td>
          <th scope='row' className='py-4  font-medium text-gray-900 whitespace-nowrap dark:text-white'>
            {item.description}
          </th>
          <td className='py-4 px-4'>{Number(item.score).toFixed(2)}</td>
          <td className='py-4 pl-4'>{Number(item.topicality).toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  )
}

export default AnalyzedTableContent
