import { Link, Typography } from "@mui/material";
import { logout } from "../../lib/logout";
import { useRouter } from "next/router";
import styles from './navbar.module.css'
import { destroyCookie } from "nookies";

export default function LogButton ({ token, handleOpen, label }) {
  const router = useRouter()

  const handleLogin = label => {
    if (label === 'Log Out') {
      logout(router, token, destroyCookie)
      destroyCookie(null, 'token')
    }
    else {
      handleOpen()
    }
  }
  console.log(token)
  return (
    <Link className={styles.logButton} variant='contained' onClick={() => handleLogin(label)}>{ label }</Link>
  )
}