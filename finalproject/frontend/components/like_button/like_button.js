import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { Typography } from '@mui/material'
import { pink } from '@mui/material/colors'
import { likeSubmit } from '../../lib/recipes'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useState, useEffect } from 'react'
import styles from './like_button.module.css'

export default function LikeButton({ token, recipe, likesAmount, setLikesAmount }) {
  const [like, setLike] = useState(false)
  const [disabledCheck, setDisabledCheck] = useState(true)

  useEffect(() => {
    if (recipe.likeStatus === true) {
      setLike(true)
    }
  }, [])

  useEffect(() => {
    if (token) {
      setDisabledCheck(false)
    }
  }, [])

  const likeHandler = event => {
    const id = recipe.id?recipe.id:recipe.recipe.id
    likeSubmit(id, token)
    if (like) {
      setLike(false)
      setLikesAmount(likesAmount - 1)
    }
    else {
      setLike(true)
      setLikesAmount(likesAmount + 1)
    }
  }

  return (
    <div className={styles.likeSection}>
      <FormControlLabel
        control={
          <Checkbox
            checked={like}
            disabled={disabledCheck}
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
        onChange={(event) => likeHandler(event)}
      />
      <Typography className={styles.likesAmount} variant='body2'>{ likesAmount }</Typography>
    </div>
  )
}
