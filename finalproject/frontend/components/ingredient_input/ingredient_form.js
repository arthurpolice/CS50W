import IngredientInput from "./ingredient_input"

export default function IngredientForm({ ingredientList, ingredientNumber, measuresList, setRecipe }) {
  // Used to iterate the components with for each
  const ingredientKeys = [...Array(ingredientNumber).keys()]
  return (
    ingredientKeys.map((key) => {
      return <IngredientInput key={key} ingredientList={ingredientList} measuresList={measuresList} setRecipe={setRecipe}/>
    })
  )
}