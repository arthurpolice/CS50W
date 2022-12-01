import { Button, TextField } from '@mui/material';
import React, { useRef } from 'react';
import { login } from '../../lib/login';
import { useTokenStore } from "../../lib/store"
import styles from './modal.module.css'
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function Login({ handleClose }) {
  const addToken = useTokenStore(state => state.addToken)
  const usernameRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(event, username, password) {
    event.preventDefault()
    const token = await login(username, password)
    addToken(token)
    handleClose()
  }

  return(
    <form className={styles.form}>
      <div className={styles.row}>
        <TextField label='Username' variant='standard' ref={usernameRef}/>
      </div>
      <div className={styles.row}>
        <TextField label='Password' variant='standard' type='password' ref={passwordRef}/>
      </div>
      <div>
        <Button onClick={(event) => handleSubmit(event, usernameRef.current.value, passwordRef.current.value)}>
          Log In
        </Button>
      </div>
    </form>
  )
}
