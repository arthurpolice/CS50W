import create from 'zustand';
import { persist } from 'zustand/middleware';

export const tokenStore = create(
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

