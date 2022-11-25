import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import Link from 'next/link';
import Image from 'next/image';
import styles from './navbar.module.css'


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
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar className={styles.navbar}>
          <Toolbar className={styles.links}>
            <Link href={'/'}><Image src={'/images/icon.png'} alt='logo' width={48} height={48}/></Link>
            <Link href={'/extract'} className={styles.link}>Recipe Extractor</Link>
            <Link href={'/catalog'} className={styles.link}>Recipe Catalog</Link>
            <Link href={'/makerecipe'} className={styles.link}>Make a Recipe</Link>
            <Link href={'/calendar'} className={styles.link}>Calendar</Link>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  )
}