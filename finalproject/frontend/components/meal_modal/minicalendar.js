import * as React from 'react'
import TextField from '@mui/material/TextField'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import styles from './modal.module.css'

export default function MiniCalendar({ day, setDay }) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        className={styles.mealFields}
        value={day}
        onChange={(newValue) => {
          setDay(newValue)
        }}
        renderInput={(params) => <TextField {...params} />}
        inputFormat="DD/MM/yyyy"
      />
    </LocalizationProvider>
  )
}
