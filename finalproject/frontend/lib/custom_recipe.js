export async function getAllIngredients() {
  const response = await fetch('http://127.0.0.1:8000/get_all_ingredients', {
    method: 'POST'
  })
  const ingredients_object = await response.json()
  const ingredients = ingredients_object.list
  return ingredients
}

export async function getAllMeasures() {
  const response = await fetch('http://127.0.0.1:8000/get_all_measures', {
    method: 'POST'
  })
  const measures_object = await response.json()
  const measures = measures_object.list
  return measures
}

export function makeRecipeObject() {
  const object = {
    name: '',
    image: '',
    extendedIngredients: []
  }
  return object
}