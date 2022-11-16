import Ingredient from "./ingredient";


export default function Ingredients({ ingredients }) {
  return (
    ingredients.map(ingredient => {
      return <Ingredient key={ingredient.api_id} ingredient={ ingredient } />
    })
  )
}