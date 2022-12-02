import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getAllIngredients, getAllMeasures, makeRecipeObject, logRecipe } from '../lib/custom_recipe'
import IngredientForm from '../components/ingredient_input/ingredient_form'
import Navbar from '../components/navbar/navbar'
import Header from '../components/ingredient_input/header';
import { Button } from '@mui/material';
import styles from '../styles/makerecipe.module.css'
import { useRouter } from 'next/router'
import { useTokenStore } from '../lib/store';
import LoginModal from '../components/login_modal/login_modal';

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
  const token = useTokenStore(state => state.token)
  const changeToken = useTokenStore(state => state.addToken)
  const route = useRouter()
  const recipeProp = makeRecipeObject()
  const [ingredientNumber, setIngredientNumber] = useState(1)
  const [recipe, setRecipe] = useState(recipeProp)
  const [measuringSystem, setMeasuringSystem] = useState('metric')
  const [openModal, setOpenModal] = useState(false)
  
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)

  const isNumeric = value => {
    return /^\d+$/.test(value);
  }

  const fieldChange = event => {
    let {name, value} = event.target
    if (name === 'servings') {
      if (isNumeric(value) === false) {
        value = 1
      }
      console.log(value)
    }
    setRecipe(prevState => ({
      ...prevState,
      [name]: Math.round(parseInt(value))
    }))
  }

  const handleClick = num => {
    setIngredientNumber(ingredientNumber + num)
    if (num === 1) {
      recipe['extendedIngredients'].push({})
    }
    else if (num === -1) {
      recipe['extendedIngredients'].pop
    }
  }

  // Checkbox names must match the key names in recipeProp
  const checkboxChange = event => {
    const {name, checked} = event.target
    setRecipe(prevState => ({
      ...prevState,
      [name]: checked
    }))
  }

  
  useEffect(()=> {
    if (!token || token === '') {
      handleOpen()
    }
  }, [token])

  return (
    <>
      <Head>
        <title>Make Custom Recipe</title>
        <meta name="description" content="Register your custom recipes and get caloric info" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navbar />
      <LoginModal open={openModal} handleClose={handleClose}/>
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
          onClick={() => handleClick(-1)}>-</Button>
        <Button 
          variant="outlined"
          onClick={() => handleClick(1)}>+</Button>
      </div>
      <div className={styles.submitButtonDiv}>
        <Button
          variant='outlined'
          color='success'
          onClick={() => logRecipe(recipe, route, token, changeToken, handleOpen)}>
            Submit
          </Button>
      </div>
    </>
  )
}