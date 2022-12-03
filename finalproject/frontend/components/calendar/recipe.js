import { Link } from "@mui/material";
import styles from './calendar.module.css'

export default function Recipe({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.name} x{recipe.servings} | {Math.round(recipe.calories)}</Link>
  )
}