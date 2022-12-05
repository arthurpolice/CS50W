import { Link } from "@mui/material";
import { useTokenStore } from "../../lib/store";
import { logout } from "../../lib/logout";
import { useRouter } from "next/router";
import styles from './navbar.module.css'

export default function LogButton ({ token, handleOpen, label }) {
  const router = useRouter()
  const changeToken = useTokenStore(state => state.addToken)

  const handleLogin = label => {
    if (label === 'Log Out') {
      logout(router, token, changeToken)
    }
    else {
      handleOpen()
    }
  }
  return (
    <Link className={styles.logButton} variant='contained' onClick={() => handleLogin(label)}>{label}</Link>
  )
}