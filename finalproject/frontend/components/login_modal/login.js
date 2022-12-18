import { Button, TextField } from '@mui/material'
import { useRef, useState } from 'react'
import { login } from '../../lib/login'
import { setCookie } from 'nookies'
import Link from 'next/link'
import styles from './modal.module.css'
import { useRouter } from 'next/router'

export default function Login({ handleClose }) {
  const route = useRouter()
  const [error, setError] = useState(false)
  const usernameRef = useRef()
  const passwordRef = useRef()

  async function handleSubmit(event, username, password) {
    event.preventDefault()
    const token = await login(username, password)
    if (token) {
      setCookie(null, 'token', token, {
        maxAge: 8 * 60 * 60,
      })
      setCookie(null, 'username', username, {
        maxAge: 8 * 60 * 60,
      })
      handleClose()
      route.reload()
    } else {
      setError(true)
    }
  }

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <TextField
          error={error}
          label='Username'
          variant='standard'
          inputRef={usernameRef}
        />
      </div>
      <div className={styles.row}>
        <TextField
          error={error}
          label='Password'
          variant='standard'
          type='password'
          inputRef={passwordRef}
        />
      </div>
      <div>
        <Button
          onClick={(event) =>
            handleSubmit(
              event,
              usernameRef.current.value,
              passwordRef.current.value
            )
          }
        >
          Log In
        </Button>
      </div>
      <div>
        <Link className={styles.register} href={'/register'}>
          Or register here.
        </Link>
      </div>
    </form>
  )
}
