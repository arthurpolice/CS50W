import Recipe from './recipe'

export default function Meal({ data, date, mealType, setTotalCalories }) {
  // If there is data, loop through it, else return an empty span
  return data ? (
    data.map((recipe) => {
      return (
        <Recipe
          key={`${recipe.recipe_id} ${recipe.servings} ${recipe.meal}`}
          recipe={recipe}
          date={date}
          mealType={mealType}
          setTotalCalories={setTotalCalories}
        />
      )
    })
  ) : (
    <span></span>
  )
}
