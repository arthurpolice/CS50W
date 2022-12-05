import { dayFetcher } from '../../lib/calendar'
import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Meal from './meal'
import styles from './calendar.module.css'

export default function Meals({ token, date }) {
  const [data, setData] = useState({})
  const [totalCalories, setTotalCalories] = useState(null)
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  // try the regular fetch way
  useEffect(() => {
    dayFetcher(token, date, setData, setTotalCalories)
  }, [token, date])
  return (
    <>
      <Typography color={'white'} variant='h5' className={styles.date}>
        {date.toLocaleDateString('en-GB', options)}
      </Typography>
      <Typography color={'white'} variant='h6' className={styles.calories}>
        {totalCalories
          ? `Calories: ${Math.round(totalCalories)}`
          : 'Day not yet registered.'}
        {totalCalories && data.targetCalories
          ? `/${data.targetCalories}`
          : null}
      </Typography>
      <br />
      <Typography color={'white'} variant='h6' className={styles.calories}>
        {totalCalories ? null : 'Please add a meal from a recipe page.'}
      </Typography>
      {totalCalories ? (
        <>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>
              {data.bf ? 'Breakfast:' : null}
            </span>
            <br />
            <Meal
              data={data.bf}
              date={date}
              mealType='bf'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>
              {data.lun ? 'Lunch:' : null}
            </span>
            <br />
            <Meal
              data={data.lun}
              date={date}
              mealType='lun'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>
              {data.din ? 'Dinner:' : null}
            </span>
            <br />
            <Meal
              data={data.din}
              date={date}
              mealType='din'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>
              {data.extra ? 'Extra:' : null}
            </span>
            <br />
            <Meal
              data={data.extra}
              date={date}
              mealType='extra'
              setTotalCalories={setTotalCalories}
            />
          </div>
        </>
      ) : null}
    </>
  )
}
