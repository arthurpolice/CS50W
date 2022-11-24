import Head from 'next/head';
import { useState } from 'react';
import { getAllIngredients, getAllMeasures, makeRecipeObject } from '../lib/custom_recipe'
import IngredientForm from '../components/ingredient_input/ingredient_form'
import Navbar from '../components/navbar/navbar'
import { Button, TextField } from '@mui/material';
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
  const [ingredientNumber, setIngredientNumber] = useState(4)
  const [recipe, setRecipe] = useState(recipeProp)
  const fieldChange = event => {
    const {name, value} = event.target
    setRecipe(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
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
        <TextField
          name='name'
          variant='standard' 
          label='Recipe Name'
          onChange={fieldChange}/>
        <IngredientForm ingredientList={ ingredientList } ingredientNumber={ ingredientNumber } measuresList={ measuresList } setRecipe={setRecipe} />
      </div>      
      <div className={styles.control}>
        <Button 
          variant="outlined"
          onClick={() => setIngredientNumber(ingredientNumber + 1)}>+</Button>
        <Button 
          variant="outlined"
          onClick={() => setIngredientNumber(ingredientNumber - 1)}>-</Button>
      </div>
    </>
  )
}