import Ingredient from "./ingredient";


export default function Ingredients({ ingredients, measurement }) {
  return (
    ingredients.map(ingredient => {
      return <Ingredient key={ingredient.api_id + ingredient.name + Math.random()} ingredient={ ingredient } measurement={ measurement } />
    })
  )
}