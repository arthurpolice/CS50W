import Image from 'next/image';
import styles from './ingredient.module.css'

export default function Ingredient({ ingredient }) {
  if (ingredient.metric_amount > 1) {
    ingredient.metric_amount = Math.round(ingredient.metric_amount * 10) / 10
  } 
  return (
    <div className={styles.row}>
      <div className={styles.ingredientimagecontainer}>
        <Image 
          src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
          alt={ingredient.name}
          layout='fill'
          className={styles.ingredientimage}
          sizes='10vw'
        />
      </div>
        <span className={styles.column}><h5 className={styles.content}>{ingredient.name.toUpperCase()}</h5></span>
        <span className={styles.column}><p className={styles.content}>{ingredient.metric_amount} {ingredient.metric_unit}</p></span>
        <span className={styles.column}><p className={styles.content}>{ingredient.imperial_amount} {ingredient.imperial_unit}</p></span>
        <span className={styles.column}><p className={styles.content}>{Math.round(ingredient.grams_amount)}g</p></span>
        <span className={styles.column}><p className={styles.content}>{Math.round(ingredient.grams_amount * ingredient.calories_per_gram)} kcal</p></span>
    </div>
  )
}