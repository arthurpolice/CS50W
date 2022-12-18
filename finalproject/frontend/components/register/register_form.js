import { Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { register } from '../../lib/register';
import styles from './register.module.css'
import { setCookie } from 'nookies';


export default function RegisterForm() {
  const route = useRouter()
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const usernameRef = useRef()
  const passwordRef = useRef()
  const emailRef = useRef()
  const confirmationRef = useRef()

  async function handleSubmit(event, username, email, password, confirmation) {
    event.preventDefault()
    if (password === confirmation) {
      const token = await register(username, email, password)
      if (token) {
        setCookie(null, 'token', token, {
          maxAge: 11 * 60 * 60
        })
        setCookie(null, 'username', username, {
          maxAge: 11 * 60 * 60
        })
        route.back()
      }
      else {
        setError(true)
        setErrorMessage("Username taken.")
      }
    }
    else {
      setError(true)
      setErrorMessage("Password entries don't match.")
    }
  }

  return(
    <form className={styles.form}>
      <div className={styles.row}>
            <Image src={'/images/icon.png'} alt='logo' width={48} height={48}/>
      </div>
      <div className={styles.row}>
        <TextField error={error} label='Username' variant='standard' inputRef={usernameRef}/>
      </div>
      <div className={styles.row}>
        <TextField error={error} label='Email' variant='standard' inputRef={emailRef}/>
      </div>
      <div className={styles.row}>
        <TextField error={error} label='Password' variant='standard' type='password' inputRef={passwordRef}/>
      </div>
      <div className={styles.row}>
        <TextField error={error} label='Confirm Password' variant='standard' type='password' inputRef={confirmationRef}/>
      </div>
      <div>
        <Button onClick={(event) => handleSubmit(event, usernameRef.current.value, emailRef.current.value, passwordRef.current.value, confirmationRef.current.value)}>
          Register
        </Button>
      </div>
      <Typography variant='body2' color={'red'}>{errorMessage}</Typography>
    </form>
  )
}
