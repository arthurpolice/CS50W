import Head from 'next/head';
import Image from 'next/image';
import { getAllRecipeIds, getRecipeData } from '../../lib/recipes'
import Date from '../../components/date';
import Ingredients from '../../components/ingredients';
import styles from '../../styles/recipes.module.css';
import { Parallax, Background } from 'react-parallax';
import Paper from '@mui/material/Paper';
import Summary from '../../components/summary';


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
  return (
    <div>
      <Head>
        <title>{ recipeData.recipe.name }</title>
      </Head>
      <div className={styles.main}>
        <Parallax className={styles.parallax} strength={300}>
          <Background className={styles.custombg}>
              <img className={styles.background} src={recipeData.recipe.image} alt="fill murray"/>
          </Background>
        </Parallax>
        <Paper className={styles.paper} elevation={3}>
          <Paper className={styles.smallpaper} elevation={5}>
            <h1>{recipeData.recipe.name}</h1>
            <div className={styles.summary}>
                <Summary className={styles.summary} recipe={recipeData.recipe} />
            </div>
        </Paper>
          <article>
            <br />
            <input type='number' className={styles.hidden} value={recipeData.id}/>
            <br />
            <div className='a'>
            </div>
            <br />
            <Ingredients ingredients={recipeData.ingredients}/>
          </article>
        </Paper>
      </div>
    </div>
  );
}
