export async function dayFetcher(token, date, setData, setTotalCalories) {
  const request = await fetch('http://127.0.0.1:8000/get_daily_plan', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      date
    })
  })
  const response = await request.json()
  console.log(response)
  if (response.day) {
    setData(response.day)
    setTotalCalories(response.day.totalCalories)
  }
  else {
    setData(response.message)
    setTotalCalories(null)
  }
}


export async function removeRecipe(token, recipeId, date, mealType) {
  const sender = await fetch('http://127.0.0.1:8000/daily_plan/remove', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    },
    body: JSON.stringify({
      recipeId,
      date,
      mealType
    })
  })
  const response = await sender.json()
}
