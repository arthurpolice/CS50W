import Head from 'next/head';
import { getAllRecipeIds, getRecipeData } from '../../lib/recipes'
import Date from '../../components/date';
import Ingredients from '../../components/ingredients';
import styles from '../../styles/recipes.module.css';


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
      <article>
        <h1>{recipeData.recipe.name}</h1>
        <br />
        <input type='number' className={styles.hidden} value={recipeData.id}/>
        <br />
        <div className='a'>
        </div>
        <br />
        <Ingredients ingredients={recipeData.ingredients}/>
      </article>
    </div>
  );
}
