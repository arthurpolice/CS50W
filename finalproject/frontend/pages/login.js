import React, { useState } from 'react';
import { login } from '../lib/login';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return(
    <form onSubmit={() => login(username, password)}>
      <label>
        <p>Username</p>
        <input type="text" onChange={(event) => setUsername(event.target.value)}/>
      </label>
      <label>
        <p>Password</p>
        <input type="password" onChange={(event) => setPassword(event.target.value)}/>
      </label>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}
