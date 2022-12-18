import { TextField, Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'
import styles from './ingredient_form.module.css'
import Image from 'next/image'

export default function IngredientInput({
  ingredientList,
  measuresList,
  recipe,
  index,
  measuringSystem,
}) {
  const [ingredient, setIngredient] = useState({ name: '' })
  const [unit, setUnit] = useState('')
  const [amount, setAmount] = useState(0)

  // This prepares the fields to be inserted in the recipe object from the custom recipe page.
  // We have to make null fields for the unused measuring system to keep things consistent with spoonacular.
  // Every time these values change, we ship them to the recipe object to be sent to the backend at any time.
  useEffect(() => {
    const measures = {
      us: {
        amount: null,
        unitShort: null,
      },
      metric: {
        amount: null,
        unitShort: null,
      },
    }
    measures[`${measuringSystem}`] = {
      amount,
      unitShort: unit,
    }
    ingredient['measures'] = measures
    recipe['extendedIngredients'][index] = ingredient
  }, [amount, ingredient, recipe, unit, index, measuringSystem])

  const ingredientChange = (data) => {
    setIngredient((prevState) => ({
      ...prevState,
      nameClean: data.name,
      id: data.api_id,
      image: data.image,
    }))
  }

  // These are part of the Autocomplete component that comes from Material UI.
  // The options are the ingredient and measurement objects themselves
  const ingredientProps = {
    options: ingredientList,
    getOptionLabel: (option) => option.name.toUpperCase(),
  }
  const measurementProps = {
    options: measuresList,
  }
  return (
    <div className={styles.row}>
      <div className={styles.ingredientimagecontainer}>
        <Image
          src={
            ingredient.image
              ? `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
              : '/images/icon.png'
          }
          alt={ingredient.nameClean ? ingredient.nameClean : 'default icon'}
          layout='fill'
          className={styles.ingredientimage}
          sizes='10vw'
        />
      </div>
      <Autocomplete
        {...ingredientProps}
        required
        clearOnEscape
        name='info'
        className={styles.ingredient}
        onChange={(event, data) => {
          ingredientChange(data)
        }}
        renderInput={(params) => (
          <TextField {...params} label='Ingredient' variant='standard' />
        )}
      />
      <TextField
        required
        variant='standard'
        label='Amount'
        name='amount'
        className={styles.amount}
        onChange={(event) => {
          setAmount(parseFloat(event.target.value))
        }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <Autocomplete
        {...measurementProps}
        required
        clearOnEscape
        name='unit'
        className={styles.unit}
        onChange={(event, data) => {
          setUnit(data)
        }}
        renderInput={(params) => (
          <TextField {...params} label='Unit' variant='standard' />
        )}
      />
    </div>
  )
}
