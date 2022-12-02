export async function dayFetcher(token, date) {
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
  return {
    data: response.day
  }
}

