import Head from 'next/head'
import { getAllRecipeIds, getRecipeData } from '../../lib/recipes'
import Ingredients from '../../components/recipes/ingredients'
import styles from '../../styles/recipes.module.css'
import { Parallax, Background } from 'react-parallax'
import { Fab } from '@mui/material'
import Paper from '@mui/material/Paper'
import Summary from '../../components/recipes/summary'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import React, { useState } from 'react'
import Image from 'next/image'
import Navbar from '../../components/navbar/navbar'
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BasicModal from '../../components/modal/modal.tsx'

library.add(faHeart, faStar)

export async function getStaticPaths() {
  const paths = await getAllRecipeIds()
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const recipeData = await getRecipeData(params.id)

  return {
    props: {
      recipeData,
    },
  }
}

export default function Recipe({ recipeData }) {
  const [measurement, setMeasurement] = useState('grams')
  const handleChange = (event) => {
    setMeasurement(event.target.value)
  }
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <Head>
        <title>{recipeData.recipe.name}</title>
      </Head>
      <Navbar />
      <BasicModal open={open} handleClose={handleClose} />
      <div className={styles.main}>
        <Parallax className={styles.parallax} strength={300}>
          <Background className={styles.custombg}>
            <Image
              className={styles.background}
              src={recipeData.recipe.image}
              alt='Recipe picture'
              layout='fill'
              objectFit='cover'
            />
          </Background>
        </Parallax>
        <div className={styles.recipeContainer}>
          <Paper className={styles.paper} elevation={3}>
            <Paper className={styles.smallpaper} elevation={5}>
              <div className={styles.floatingButtons}>
                <Fab className={styles.fabHeart} title='Like' aria-label='like'>
                  <FontAwesomeIcon className={styles.heartIcon} icon='heart' />
                </Fab>
                <Fab
                  className={styles.fabStar}
                  title='Favorite'
                  aria-label='favorite'
                >
                  <FontAwesomeIcon className={styles.starIcon} icon='star' />
                </Fab>
                <Fab
                  className={styles.fabAdd}
                  variant='extended'
                  color='success'
                  onClick={handleOpen}
                >
                  Add Meal
                </Fab>
              </div>
              <h1 className={styles.title}>{recipeData.recipe.name}</h1>
              <div className={styles.summary}>
                <Summary recipe={recipeData.recipe} />
              </div>
            </Paper>
            <article>
              <FormControl className={styles.form}>
                <RadioGroup
                  className={styles.buttons}
                  row
                  name='measurement'
                  value={measurement}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='grams'
                    control={<Radio />}
                    label='Grams'
                  />
                  <FormControlLabel
                    value='metric'
                    control={<Radio />}
                    label='Metric'
                  />
                  <FormControlLabel
                    value='imperial'
                    control={<Radio />}
                    label='US (Imperial)'
                  />
                </RadioGroup>
              </FormControl>
              <br />
              <input
                type='number'
                className={styles.hidden}
                value={recipeData.id}
              />
              <br />
              <h3 className={styles.ingredientssection}>
                Ingredient Breakdown
              </h3>
              <Ingredients
                ingredients={recipeData.ingredients}
                measurement={measurement}
              />
            </article>
          </Paper>
        </div>
      </div>
    </>
  )
}
