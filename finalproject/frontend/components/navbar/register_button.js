import { MenuItem } from '@mui/material'
import styles from './navbar.module.css'
import Link from 'next/link'

export default function RegisterButton({ register }) {
  if (register) {
    return (
      <MenuItem>
        <Link className={styles.logButton} href={'/register'}>
          {register}
        </Link>
      </MenuItem>
    )
  }
  else {
    <span className={styles.hidden}></span>
  }
}