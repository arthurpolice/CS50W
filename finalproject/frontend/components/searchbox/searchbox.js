import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { pink } from '@mui/material/colors'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import Favorite from '@mui/icons-material/Favorite'
import styles from './searchbox.module.css'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'

export default function SearchBox({ setSearchField, setLikeFilter }) {
  const cookies = parseCookies()
  const token = cookies.token
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (token) {
      setDisabled(false)
    }
  })


  return (
    <div className={styles.searchDiv}>
      <TextField
        className={styles.searchBox}
        variant='standard'
        type='search'
        label='Search Catalog'
        onChange={(event) => setSearchField(event.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={disabled}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            sx={{
              color: pink[800],
              '&.Mui-checked': {
                color: pink[600],
              },
            }}
          />
        }
        onChange={(event) => setLikeFilter(event.target.checked)}
      />
    </div>
  )
}
