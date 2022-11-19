import Head from 'next/head';
import Image from 'next/image';
import { getAllRecipeIds, getRecipeData } from '../../lib/recipes'
import Date from '../../components/date';
import Ingredients from '../../components/ingredients';
import styles from '../../styles/recipes.module.css';
import { Parallax, Background } from 'react-parallax';
import Paper from '@mui/material/Paper';
import Summary from '../../components/summary';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import React, { useState } from 'react';



export async function getStaticPaths() {
  const paths = await getAllRecipeIds();
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
    <div>
      <Head>
        <title>{ recipeData.recipe.name }</title>
      </Head>
      <div className={styles.main}>
        <Parallax className={styles.parallax} strength={300}>
          <Background className={styles.custombg}>
              <img className={styles.background} src={recipeData.recipe.image} alt="Recipe picture"/>
          </Background>
        </Parallax>
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
  );
}
