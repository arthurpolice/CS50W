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
    title: '',
    image: '',
    sourceUrl: '',
    id: -1,
    cuisines: [''],
    extendedIngredients: [],
    vegan: false,
    vegetarian: false,
    dairyFree: false,
    glutenFree: false,
    ketogenic: false
  }
  return object
}

// Data sender

export async function logRecipe(recipe, router) {
  console.log(recipe)
  const response = await fetch('http://127.0.0.1:8000/log_custom', {
    method: 'POST',
    body: JSON.stringify({
      recipe
    })
  })
  const response_json = await response.json()
  const id = response_json['id']
  console.log['id']
  router.push(`recipes/${id}`)
}