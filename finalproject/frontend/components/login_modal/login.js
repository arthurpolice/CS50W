import { Button, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { login } from '../../lib/login';
import { useTokenStore } from "../../lib/store"
import styles from './modal.module.css'


export default function Login({ handleClose }) {
  const [error, setError] = useState(false)
  const addToken = useTokenStore(state => state.addToken)
  const addUsername = useTokenStore(state => state.addUsername)
  const usernameRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(event, username, password) {
    event.preventDefault()
    const token = await login(username, password)
    if (token) {
      addToken(token)
      addUsername(username)
      handleClose()
    }
    else {
      setError(true)
    }
  }

  return(
    <form className={styles.form}>
      <div className={styles.row}>
        <TextField error={error} label='Username' variant='standard' inputRef={usernameRef}/>
      </div>
      <div className={styles.row}>
        <TextField error={error} label='Password' variant='standard' type='password' inputRef={passwordRef}/>
      </div>
      <div>
        <Button onClick={(event) => handleSubmit(event, usernameRef.current.value, passwordRef.current.value)}>
          Log In
        </Button>
      </div>
    </form>
  )
}
