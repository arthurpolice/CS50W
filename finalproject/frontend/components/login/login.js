import React, { useRef } from 'react';
import { login } from '../../lib/login';
import { useTokenStore } from "../../lib/store"

export default function Login() {
  const addToken = useTokenStore(state => state.addToken)
  const usernameRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(event, username, password) {
    event.preventDefault()
    const token = await login(username, password)
    addToken(token)
  }

  return(
    <form onSubmit={(event) => handleSubmit(event, usernameRef.current.value, passwordRef.current.value)}>
      <label>
        <p>Username</p>
        <input type="text" ref={usernameRef}/>
      </label>
      <label>
        <p>Password</p>
        <input type="password" ref={passwordRef}/>
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
