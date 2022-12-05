import { Link, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import styles from './navbar.module.css'

export default function RecipesButton() {
  const [anchorEl, setAnchorEl] = useState(null)
  const handlePopOpen = event => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl);
  return (
    <>
      <Typography
        onClick={handlePopOpen}
        className={styles.link}
      >
        Recipes
      </Typography>
      <Menu
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopClose}
        disableRestoreFocus
      >
        <MenuItem>
          <Link href={'/catalog'} className={styles.menuItem}>Recipe Catalog</Link>
        </MenuItem>
        <MenuItem>
          <Link href={'/extract'} className={styles.menuItem}>Recipe Extractor</Link>
        </MenuItem>
        <MenuItem>
          <Link href={'/makerecipe'} className={styles.menuItem}>Make a Recipe</Link>
        </MenuItem>
      </Menu>
    </>
  )

}