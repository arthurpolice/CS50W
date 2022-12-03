import { dayFetcher } from "../../lib/calendar"
import { useEffect, useState } from "react"
import { Typography } from "@mui/material";
import Meal from "./meal";
import styles from './calendar.module.css'

export default function Meals({ token, date }) {
  const [data, setData] = useState({})
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // try the regular fetch way
  useEffect(() =>{
    dayFetcher(token, date, setData)
  }, [token, date])
  return (
    <>
      <Typography color={'white'} variant='h5' className={styles.date}>{date.toLocaleDateString('en-GB', options)}</Typography>
      <Typography color={'white'} variant='h6' className={styles.calories}>{data.totalCalories? `Calories: ${Math.round(data.totalCalories)}`:'Day not yet registered.'}{data.totalCalories&&data.targetCalories?`/${data.targetCalories}`:null}</Typography>
      <div className={styles.mealRow}>
        <span className={styles.mealName}>{data.bf?'Breakfast:':null}</span><Meal data={data.bf}/>
      </div>
      <div className={styles.mealRow}>
        <span className={styles.mealName}>{data.lun?'Lunch:':null}</span><Meal data={data.lun}/>
      </div>
      <div className={styles.mealRow}>
        <span className={styles.mealName}>{data.din?'Dinner:':null}</span><Meal data={data.din}/>
      </div>
      <div className={styles.mealRow}>
        <span className={styles.mealName}>{data.extra?'Extra:':null}</span><Meal data={data.extra}/>
      </div>
    </>
  )
}

