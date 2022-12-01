export async function getAllIngredients() {
  const response = await fetch('http://127.0.0.1:8000/get_all_ingredients', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  })
  const ingredients_object = await response.json()
  const ingredients = ingredients_object.list
  return ingredients
}

export async function getAllMeasures() {
  const response = await fetch('http://127.0.0.1:8000/get_all_measures', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
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

export async function logRecipe(recipe, router, token) {
  const response = await fetch('http://127.0.0.1:8000/log_custom', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      recipe
    })
  })
  const response_json = await response.json()
  const id = response_json['id']
  console.log['id']
  router.push(`recipes/${id}`)
}