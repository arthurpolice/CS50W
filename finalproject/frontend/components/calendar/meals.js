import { dayFetcher } from "../../lib/calendar"
import { useEffect, useState } from "react"
import { Typography } from "@mui/material";
import Meal from "./meal";

export default function Meals({ token, date }) {
  const [data, setData] = useState({})
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // try the regular fetch way
  useEffect(() =>{
    dayFetcher(token, date, setData)
  }, [token, date])
  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <>
      <Typography>{date.toLocaleDateString('en-GB', options)}</Typography>
      <Typography>{data.totalCalories?Math.round(data.totalCalories):'Day not yet registered.'}</Typography>
      <div>
        <span>{data.bf?'Breakfast:':null}</span><Meal data={data.bf}/>
      </div>
      <div>
        <span>{data.lun?'Lunch:':null}</span><Meal data={data.lun}/>
      </div>
      <div>
        <span>{data.din?'Dinner:':null}</span><Meal data={data.din}/>
      </div>
      <div>
        <span>{data.extra?'Extra:':null}</span><Meal data={data.extra}/>
      </div>
    </>
  )
}

