export async function sendUrl(url, router) {
  const sender = await fetch('http://127.0.0.1:8000/extract_recipe', {
    method: 'POST',
    body: JSON.stringify({
      url
    })
  })
  const response = await sender.json()
  if ('id' in response) {
    const id = response.id
    router.push(`/recipes/${id}`)
  }
  else {
    router.push('/extract')
  }
}