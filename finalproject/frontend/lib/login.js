export async function login(username, password) {
  const login = await fetch('http://127.0.0.1:8000/login', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  	body: JSON.stringify({
  		username,
  		password
  	})
  })
  login.json()
  return login
}