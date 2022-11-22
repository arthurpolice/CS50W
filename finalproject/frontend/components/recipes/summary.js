import Link from "next/link"
import styles from './summary.module.css';

export default function Summary({ recipe }) {
  return (
    <>
      <span>Total Servings: {recipe.total_servings}</span>
      <span>Calories per Serving: {Math.round(recipe.calories / recipe.total_servings)}</span>
      <span>Source: <Link className={styles.sourceurl} href={recipe.url}>{recipe.credit}</Link></span>
    </>
  )
}
