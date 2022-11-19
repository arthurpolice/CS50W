import Ingredient from "./ingredient";


export default function Ingredients({ ingredients, measurement }) {
  return (
    ingredients.map(ingredient => {
      return <Ingredient key={ingredient.api_id} ingredient={ ingredient } measurement={ measurement } />
    })
  )
}