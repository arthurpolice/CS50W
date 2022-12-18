import { dayFetcher } from '../../lib/calendar'
import { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import Meal from './meal'
import styles from './calendar.module.css'

export default function Meals({ token, date }) {
  const [data, setData] = useState({})

  const [totalCalories, setTotalCalories] = useState(null)
  const [dayCalories, setDayCalories] = useState('Loading...')
  const [targetCalories, setTargetCalories] = useState('')
  const [helperMessage, setHelperMessage] = useState(null)

  const [breakfastHeader, setBreakfastHeader] = useState(null)
  const [lunchHeader, setLunchHeader] = useState(null)
  const [dinnerHeader, setDinnerHeader] = useState(null)
  const [extraHeader, setExtraHeader] = useState(null)

  // This formats the date to be displayed in the calendar header.
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

  useEffect(() => {
    if (data) {
      // If there is data about the calories for a day (aka there is a meal registered in the fetched day), display it, else help the user understand what to do
      totalCalories
        ? setDayCalories(`Calories: ${Math.round(totalCalories)}`)
        : setDayCalories('Day not yet registered.')
      totalCalories
        ? setHelperMessage(null)
        : setHelperMessage('Please add a meal from a recipe page.')
      // If the user has target calories registered in their account, display them.
      totalCalories && data.targetCalories
        ? setTargetCalories(`/${data.targetCalories}`)
        : setTargetCalories(null)
    }
  }, [totalCalories, data])

  // If there is data for a given meal, display a tag for it ("Breakfast:"), else show nothing
  useEffect(() => {
    if (data) {
      data.bf ? setBreakfastHeader('Breakfast:') : setBreakfastHeader(null)
      data.lun ? setLunchHeader('Lunch:') : setLunchHeader(null)
      data.din ? setDinnerHeader('Dinner:') : setDinnerHeader(null)
      data.extra ? setExtraHeader('Extra:') : setExtraHeader(null)
    }
  }, [data])

  if (!data) {
    return (
      <>
        <Typography color={'white'} variant='h5' className={styles.date}>
          {date.toLocaleDateString('en-GB', options)}
        </Typography>
        <br />
        <Typography color={'white'} variant='h6' className={styles.calories}>
          Please log in.
        </Typography>
      </>
    )
  }
  return (
    <>
      <Typography color={'white'} variant='h5' className={styles.date}>
        {date.toLocaleDateString('en-GB', options)}
      </Typography>
      <Typography color={'white'} variant='h6' className={styles.calories}>
        {dayCalories}
        {targetCalories}
      </Typography>
      <br />
      <Typography color={'white'} variant='h6' className={styles.calories}>
        {helperMessage}
      </Typography>
      {totalCalories ? (
        <>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>{breakfastHeader}</span>
            <br />
            <Meal
              data={data.bf}
              date={date}
              mealType='bf'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>{lunchHeader}</span>
            <br />
            <Meal
              data={data.lun}
              date={date}
              mealType='lun'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>{dinnerHeader}</span>
            <br />
            <Meal
              data={data.din}
              date={date}
              mealType='din'
              setTotalCalories={setTotalCalories}
            />
          </div>
          <div className={styles.mealRow}>
            <span className={styles.mealName}>{extraHeader}</span>
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
