import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAllIngredients, getAllMeasures, makeRecipeObject, logRecipe } from '../lib/custom_recipe'
import IngredientForm from '../components/ingredient_input/ingredient_form'
import Navbar from '../components/navbar/navbar'
import Header from '../components/ingredient_input/header';
import { Button } from '@mui/material';
import styles from '../styles/makerecipe.module.css'

export async function getStaticProps() {
  const ingredientList = await getAllIngredients()
  const measuresList = await getAllMeasures()
  return {
    props: {
      ingredientList,
      measuresList,
    },
    revalidate: 60,
  };
}

export default function CustomRecipePage({ ingredientList, measuresList }) {
  const recipeProp = makeRecipeObject()
  const [ingredientNumber, setIngredientNumber] = useState(1)
  const [recipe, setRecipe] = useState(recipeProp)
  const [measuringSystem, setMeasuringSystem] = useState('metric')

  const fieldChange = event => {
    let {name, value} = event.target
    if (name === 'servings') {
      if (Number.isInteger(value) === false) {
        value = 1
      }
    }
    setRecipe(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  // Checkbox names must match the key names in recipeProp
  const checkboxChange = event => {
    const {name, checked} = event.target
    setRecipe(prevState => ({
      ...prevState,
      [name]: checked
    }))
  }
  useEffect(() => {
    if (recipe['extendedIngredients'].length < ingredientNumber) {
      recipe['extendedIngredients'].push('')
    }
    else if (recipe['extendedIngredients'].length > ingredientNumber){
      recipe['extendedIngredients'].pop()
    } 
  }, [recipe, ingredientNumber])
  return (
    <>
      <Head>
        <title>Make Custom Recipe</title>
        <meta name="description" content="Register your custom recipes and get caloric info" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navbar />
      <div className={styles.form}>
        <Header fieldChange={fieldChange} setMeasuringSystem={setMeasuringSystem} checkboxChange={checkboxChange}/>
        <IngredientForm 
          ingredientList={ ingredientList } 
          ingredientNumber={ ingredientNumber } 
          measuresList={ measuresList } 
          setRecipe={setRecipe} 
          recipe={recipe}
          measuringSystem={ measuringSystem }/>
      </div>      
      <div className={styles.control}>
        <Button 
          variant="outlined"
          color='error'
          onClick={() => setIngredientNumber(ingredientNumber - 1)}>-</Button>
        <Button 
          variant="outlined"
          onClick={() => setIngredientNumber(ingredientNumber + 1)}>+</Button>
      </div>
      <div className={styles.submitButtonDiv}>
        <Button
          variant='outlined'
          color='success'
          onClick={() => logRecipe(recipe)}>
            Submit
          </Button>
      </div>
    </>
  )
}