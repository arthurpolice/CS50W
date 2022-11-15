export async function getAllRecipesId() {
  const recipes = await fetch('http://127.0.0.1:8000/get_all_recipes', {
    method: 'POST'
  })
  const json_recipes = await recipes.json()
  
  return IDs = json_recipes.list.map((recipe) => {
    return {
      params: {
        id: Object.entries(recipe)[0][0],
        name: Object.entries(recipe)[0][1]
      }
    }
  })
}

export async function getRecipeData(id) {
  const recipe = await fetch(`http://127.0.0.1:8000/get_recipe/${id}`, {
    method: 'POST'
  })
  const json_recipe = await recipe.json()
  console.log(json_recipe)
  return json_recipe
}