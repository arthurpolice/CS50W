import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'
import Link from 'next/link'
import Image from 'next/image'
import styles from './navbar.module.css'
import UserButton from './user_button'
import LoginModal from '../login_modal/login_modal'
import RecipesButton from './recipes_button'
import PlanButton from './plan_button'
import { parseCookies } from 'nookies'

// Function provided by material UI.
function HideOnScroll(props) {
  const { children } = props
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Navbar(props) {
  const cookies = parseCookies()
  const token = cookies.token
  const [label, setLabel] = React.useState('Log Out')
  const [register, setRegister] = React.useState(null)
  // Change the log button's label based on the presence of an authentication token.
  React.useEffect(() => {
    if (!token || token === '') {
      setLabel('Log In')
      setRegister('Register')
    } else {
      setLabel('Log Out')
      setRegister(null)
    }
  }, [token])

  // Modal controllers
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <HideOnScroll {...props}>
        <AppBar className={styles.navbar}>
          <Toolbar className={styles.links}>
            <div className={styles.linkButtons}>
              <Link href={'/'}>
                <Image
                  src={'/images/icon.png'}
                  alt='logo'
                  width={48}
                  height={48}
                />
              </Link>
              <RecipesButton />
              <PlanButton />
            </div>
            <div className={styles.logButtonDiv}>
              <UserButton token={token} label={label} handleOpen={handleOpen} register={register}/>
            </div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <LoginModal open={open} handleClose={handleClose} />
    </>
  )
}
