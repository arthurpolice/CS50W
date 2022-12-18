import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Select, MenuItem, Button, FormControl } from '@mui/material'
import MiniCalendar from './minicalendar'
import styles from './modal.module.css'
import { InputLabel } from '@mui/material'
import { useState } from 'react'
import { addMeal } from '../../lib/recipes'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import NumberSelect from '../number_select/number_select'

export default function MealModalContent({ id }) {
  const [meal, setMeal] = useState('')
  const [day, setDay] = useState(null)
  const [servings, setServings] = useState(1)
  const [error, setError] = useState('')
  const route = useRouter()
  const cookies = parseCookies()
  const token = cookies.token

  const submitMeal = () => {
    if (day) {
      addMeal(id, meal, day['_d'], servings, token, route)
    } else {
      setError('Invalid date.')
    }
  }
  React.useEffect(() => {
    console.log(servings)
  }, [servings])

  return (
    <>
      <div className={styles.boxDiv}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          When will you eat this?
        </Typography>
        <MiniCalendar day={day} setDay={setDay} />
        <div className={styles.row}>
          <FormControl required className={styles.formControl}>
            <Select
              displayEmpty
              variant='standard'
              required
              value={meal}
              onChange={(event) => setMeal(event.target.value)}
            >
              <MenuItem className={styles.placeholder} disabled value=""> Meal </MenuItem>
              <MenuItem value={'bf'}>Breakfast</MenuItem>
              <MenuItem value={'lun'}>Lunch</MenuItem>
              <MenuItem value={'din'}>Dinner</MenuItem>
              <MenuItem value={'extra'}>Extra</MenuItem>
            </Select>
          </FormControl>
          <NumberSelect
            required
            className={styles.servings}
            num={200}
            decimalSlots={0}
            variableName={Object.keys({ servings })}
            setVariable={setServings}
          />
        </div>
      </div>
      <div className={styles.buttonDiv}>
        <Button onClick={submitMeal}>Add</Button>
      </div>
      <Typography color={'red'} variant='body2' component='p'>
        {error}
      </Typography>
    </>
  )
}
