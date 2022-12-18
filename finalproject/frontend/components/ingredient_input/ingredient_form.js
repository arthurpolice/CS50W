import IngredientInput from './ingredient_input'

export default function IngredientForm({
  ingredientList,
  ingredientNumber,
  measuresList,
  setRecipe,
  recipe,
  measuringSystem,
}) {

  // Used to iterate the components with map
  const ingredientKeys = [...Array(ingredientNumber).keys()]
  return ingredientKeys.map((key) => {
    return (
      <IngredientInput
        key={key}
        ingredientList={ingredientList}
        measuresList={measuresList}
        setRecipe={setRecipe}
        recipe={recipe}
        index={key}
        measuringSystem={measuringSystem}
      />
    )
  })
}
