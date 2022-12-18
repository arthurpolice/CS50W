import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import LogButton from './log_button'
import UserAvatar from './user_avatar'
import RegisterButton from './register_button'
import styles from './navbar.module.css'

export default function UserButton({ token, label, handleOpen, register }) {
  const [username, setUsername] = useState('-')
  useEffect(() => {
    const cookies = parseCookies()
    setUsername(cookies.username)
  })

  const [anchorEl, setAnchorEl] = useState(null)
  const handlePopOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  console.log(token)
  return (
    <>
      <UserAvatar username={username} handlePopOpen={handlePopOpen} />
      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handlePopClose}
        disableRestoreFocus
      >
        <MenuItem>
          <LogButton token={token} label={label} handleOpen={handleOpen} />
        </MenuItem>
        <RegisterButton register={register} />
      </Menu>
    </>
  )
}
