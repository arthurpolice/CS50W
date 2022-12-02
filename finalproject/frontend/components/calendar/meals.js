import { dayFetcher } from "../../lib/calendar"
import useSWR from 'swr'

export default function Meals({ token, date }) {
  // try the regular fetch way
  const { data, error } = useSWR('get_daily_plan', dayFetcher(token, date))
  console.log(data)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <p>{data.date}</p>
  )
}

