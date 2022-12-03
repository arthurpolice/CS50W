import Recipe from './recipe'
import styles from './calendar.module.css'

export default function Meal({ data }) {
  return data ? (
    data.map((recipe) => {
      return (
        <Recipe
          key={`${recipe.id} ${recipe.servings} ${recipe.meal}`}
          recipe={recipe}
        />
      )
    })
  ) : (
    <span></span>
  )
}
