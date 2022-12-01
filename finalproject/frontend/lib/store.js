import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useTokenStore = create(
  persist(
    (set) => ({
      token: '',
      addToken: (newToken) =>
        set(() => ({token: newToken}))
    }), 
    {
       name: 'token'
    }
  )
)


export async function checkToken(token, changeToken) {
  const check = await fetch('http://127.0.0.1:8000/check_token', {
    method:'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`
    }
  })
    const response = await check.json()
    if (response.detail === 'Invalid token.') {
      changeToken('')
    }
}