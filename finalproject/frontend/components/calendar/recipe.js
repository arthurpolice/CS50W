import { Link } from "@mui/material";
import styles from './calendar.module.css'

export default function Recipe({ recipe }) {
  return (
    <Link className={styles.recipe} underline='none' href={`/recipes/${recipe.recipe_id}`}>{recipe.name.substring(0, 30)} x{recipe.servings} | {Math.round(recipe.calories)}</Link>
  )
}