export async function register(username, email, password) {
  const register = await fetch('http://127.0.0.1:8000/register', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  	body: JSON.stringify({
  		username,
      email,
  		password
  	})
  })
  const response = await register.json()
  const token = response.token
  return token
}