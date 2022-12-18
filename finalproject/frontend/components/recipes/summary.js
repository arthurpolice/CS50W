import Link from 'next/link'
import styles from './summary.module.css'

export default function Summary({ recipe }) {
  return (
    <>
      <span className={styles.info}>
        Total Servings: {recipe.total_servings}
      </span>
      <span className={styles.info}>
        Calories per Serving:{' '}
        {Math.round(recipe.calories / recipe.total_servings)}
      </span>
      <span className={styles.info}>
        Source:{' '}
        <Link className={styles.sourceurl} href={recipe.url}>
          {recipe.credit}
        </Link>
      </span>
    </>
  )
}
