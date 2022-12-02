export async function sendUrl(url, route, token, changeToken, setErrorMessage, setLoading, handleOpen) {
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
  if ('detail' in response) {
    if (response.detail === 'Invalid token.' || response.detail === "Invalid token header. No credentials provided.") {
      setLoading(false)
      changeToken('')
      handleOpen()
    }
  }
  else if ('id' in response) {
    const id = response.id
    route.push(`/recipes/${id}`)
  }
  else {
    setErrorMessage('Invalid URL!')
    setLoading(false)
  }
}