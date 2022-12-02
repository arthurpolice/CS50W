export async function getAllRecipeIds() {
  const recipes = await fetch('http://127.0.0.1:8000/get_all_recipes', {
    method: 'POST'
  })
  const json_recipes = await recipes.json()
  
  return json_recipes.list.map((recipe) => {
    return {
      params: {
        id: `${recipe.id}`,
      },
    }
  })
}

export async function getRecipeData(id) {
  const recipe_info = await fetch(`http://127.0.0.1:8000/get_recipe/${id}`, {
    method: 'POST'
  })
  const json_recipe_info = await recipe_info.json()
  const recipe =  json_recipe_info.info
  return recipe
}

export async function deleteRecipe(id, token, route) {
  const sender = await fetch('http://127.0.0.1:8000/remove_recipe', {
    method: 'POST',
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({
      id
    })
  })
  const response = sender.json()
  console.log(response)
  route.push('/catalog')
}