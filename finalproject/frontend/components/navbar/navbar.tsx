import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import Link from 'next/link';
import Image from 'next/image';
import styles from './navbar.module.css'
import LogButton from './log_button';
import LoginModal from '../login_modal/login_modal';
import { useTokenStore } from '../../lib/store';
import RecipesButton from './recipes_button'


function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
        {children}
    </Slide>
  );
}

export default function Navbar( props ) {
  const token = useTokenStore(state => state.token)
  const [label, setLabel] = React.useState('Log Out')
  React.useEffect(() => {
    if (!token || token === '') {
      setLabel('Log In')
    }
    else {
      setLabel('Log Out')
    }
  }, [token])
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={styles.navbar}>
          <Toolbar className={styles.links}>
            <Link href={'/'}><Image src={'/images/icon.png'} alt='logo' width={48} height={48}/></Link>
            <RecipesButton />
            <Link href={'/calendar'} className={styles.link}>Calendar</Link>
            <LogButton token={token} label={label} handleOpen={handleOpen} />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <LoginModal open={open} handleClose={handleClose}/>
    </React.Fragment>
  )
}