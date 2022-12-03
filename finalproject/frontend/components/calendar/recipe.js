import { Link } from "@mui/material";

export default function Recipe({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.recipe_id}`}>{recipe.name} | {Math.round(recipe.calories)}</Link>
  )
}