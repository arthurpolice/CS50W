import Head from 'next/head';
import { getAllRecipeIds, getRecipeData } from '../../lib/recipes'
import Ingredients from '../../components/recipes/ingredients';
import styles from '../../styles/recipes.module.css';
import { Parallax, Background } from 'react-parallax';
import Paper from '@mui/material/Paper';
import Summary from '../../components/recipes/summary';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '../../components/navbar/navbar';



export async function getStaticPaths() {
  const paths = await getAllRecipeIds();
  console.log(paths)
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const recipeData = await getRecipeData(params.id);
  
  return {
    props: {
      recipeData,
    },
  };
}

export default function Recipe({ recipeData }) {
  const [measurement, setMeasurement] = useState('grams')
  const handleChange = (event) => {
    setMeasurement(event.target.value)
  }
  return (
    <>
      <Head>
        <title>{ recipeData.recipe.name }</title>
      </Head>
      <Navbar/>
      <div className={styles.main}>
        <Parallax className={styles.parallax} strength={300}>
          <Background className={styles.custombg}>
              <Image className={styles.background} src={recipeData.recipe.image} alt="Recipe picture" layout='fill' objectFit='cover'/>
          </Background>
        </Parallax>
        <div className={styles.recipeContainer}>
          <Paper className={styles.paper} elevation={3}>
            <Paper className={styles.smallpaper} elevation={5}>
              <h1 className={styles.title}>{recipeData.recipe.name}</h1>
              <div className={styles.summary}>
                  <Summary className={styles.summary} recipe={recipeData.recipe} />
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
                    <FormControlLabel value='grams' control={<Radio />} label="Grams" />
                    <FormControlLabel value='metric' control={<Radio />} label="Metric" />
                    <FormControlLabel value='imperial' control={<Radio />} label="US (Imperial)" />
                  </RadioGroup>
              </FormControl>
              <br />
              <input type='number' className={styles.hidden} value={recipeData.id}/>
              <br />
              <h3 className={styles.ingredientssection}>Ingredient Breakdown</h3>
              <Ingredients ingredients={recipeData.ingredients} measurement={measurement}/>
            </article>
          </Paper>
        </div>
      </div>
    </>
  );
}
