import { TextField, Autocomplete } from '@mui/material'
import { useState } from 'react'
import styles from './ingredient_form.module.css'



export default function IngredientInput({ ingredientList, measuresList, setRecipe, index }) {
  const [ingredient, setIngredient] = useState({})
  const [unit, setUnit] = useState('')

  const ingredientChange = (event, data) => {
    setIngredient(prevState => ({
      ...prevState,
      nameClean: data.name,
      id: data.api_id,
    }))
  }
  const unitChange = (event, data) => setUnit(data)

  const ingredientProps = {
    options: ingredientList,
    getOptionLabel: (option) => option.name.toUpperCase()
  }
  const measurementProps = {
    options: measuresList
  }
  return (
  <div className={styles.row}>
    <Autocomplete
      {...ingredientProps}
      clearOnEscape
      name='info'
      className={styles.ingredient}
      onChange={(event, data) => {ingredientChange(event, data)}
    }
      renderInput={(params) => (
        <TextField {...params} label='Ingredient' variant="standard" />
    )}
    />
    <TextField 
      variant='standard' 
      label='Amount'
      name='amount'
      onChange={(event, data) => {ingredientChange(event, data)}}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
    <Autocomplete
      {...measurementProps}
      clearOnEscape
      name='unit'
      className={styles.unit}
      onChange={(event, data) => {ingredientChange(event, data)}}
      renderInput={ (params) => (
          <TextField {...params} label='Unit' variant="standard" />
      )}
    />
  </div>
  )
}