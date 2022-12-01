export async function sendUrl(url, route, token, setErrorMessage, setLoading) {
  const sender = await fetch('http://127.0.0.1:8000/extract_recipe', {
    method: 'POST',
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({
      url
    })
  })
  const response = await sender.json()
  console.log(response)
  if ('id' in response) {
    const id = response.id
    route.push(`/recipes/${id}`)
  }
  else {
    setErrorMessage('Invalid URL!')
    setLoading(false)
  }
}