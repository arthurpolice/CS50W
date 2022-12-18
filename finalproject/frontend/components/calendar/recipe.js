import { useState } from 'react'
import { removeRecipe } from '../../lib/calendar'
import { parseCookies } from 'nookies'
import { Button, Link, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import styles from './calendar.module.css'

export default function Recipe({ recipe, date, mealType, setTotalCalories }) {
  const cookie = parseCookies()
  const token = cookie.token

  const [anchorEl, setAnchorEl] = useState(null)
  const handlePopOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  // This hides the recipes when the user deletes them, so we don't need to refresh the page.
  const [visibility, setVisibility] = useState(true)
  
  const removeMeal = () => {
    removeRecipe(token, recipe.recipe_id, date, mealType)
    setVisibility(false)
    setTotalCalories((previous) => previous - recipe.calories)
    handlePopClose()
  }

  return (
    <>
      {visibility ? (
        <Typography
          visibility={visibility}
          onClick={handlePopOpen}
          className={styles.recipe}
        >
          {recipe.name.substring(0, 30)} x{recipe.servings} |{' '}
          {Math.round(recipe.calories)} Kcal
        </Typography>
      ) : null}
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
          <Link
            className={styles.menuItem}
            href={`/recipes/${recipe.recipe_id}`}
          >
            Recipe Page
          </Link>
        </MenuItem>
        <MenuItem>
          <Link className={styles.menuItem} href={recipe.source}>
            Source Recipe
          </Link>
        </MenuItem>
        <div className={styles.deleteButton}>
          <Button variant='outlined' color='error' onClick={removeMeal}>
            Delete
          </Button>
        </div>
      </Menu>
    </>
  )
}
