import { Button, Link, Typography } from "@mui/material";
import styles from './calendar.module.css'
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem'
import { useState } from "react";


export default function Recipe({ recipe }) {
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
      <Typography onClick={handlePopOpen} className={styles.recipe}>{recipe.name.substring(0, 30)} x{recipe.servings} | {Math.round(recipe.calories)} Kcal</Typography>
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
          <Link className={styles.menuItem} href={`/recipes/${recipe.recipe_id}`}>Recipe Page</Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles.menuItem} href={`/recipes/${recipe.url}`}>Source Recipe</Link>
        </MenuItem>
        <MenuItem className={styles.deleteButton}>
          <Button variant='outlined' color='error'>Delete</Button>
        </MenuItem>
      </Menu>  
    </>
  )
}