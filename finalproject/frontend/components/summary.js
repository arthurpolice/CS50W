export default function Summary({ recipe }) {
  return (
    <>
      <span>Total Servings: {recipe.total_servings}</span>
      <span>Calories per Serving: {Math.round(recipe.calories / recipe.total_servings)}</span>
    </>
  )
}
