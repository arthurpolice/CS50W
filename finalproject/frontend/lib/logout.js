export async function logout(route, token, destroyCookie) {
  const sender = await fetch('http://127.0.0.1:8000/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`
    },
  })
  destroyCookie(null, 'token')
  destroyCookie(null, 'username')
  route.push('/')
}