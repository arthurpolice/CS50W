import Recipe from './recipe'

export default function Meal({ data, date, mealType, setTotalCalories }) {
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
