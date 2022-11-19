import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ingredient.module.css'

export default function Ingredient({ ingredient, measurement }) {
  if (ingredient.metric_amount > 1) {
    ingredient.metric_amount = Math.round(ingredient.metric_amount * 10) / 10
  }
  const [amount, setAmount] = useState(0)
  const [unit, setUnit] = useState('')

  useEffect(() => {
    switch (measurement) {
      case 'metric':
        setAmount(ingredient.metric_amount)
        setUnit(ingredient.metric_unit)
        break
      case 'imperial':
        setAmount(ingredient.imperial_amount)
        setUnit(ingredient.imperial_unit)
        break
      case 'grams':
        setAmount(Math.round(ingredient.grams_amount))
        setUnit('Grams')
        break
    }
  }, [measurement, ingredient.metric_amount, ingredient.metric_unit, ingredient.imperial_amount, ingredient.imperial_unit, ingredient.grams_amount])

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
        <span className={styles.column}><p className={styles.content}>{amount} {unit}</p></span>
        <span className={styles.column}><p className={styles.content}>{Math.round(ingredient.grams_amount * ingredient.calories_per_gram)} kcal</p></span>
    </div>
  )
}