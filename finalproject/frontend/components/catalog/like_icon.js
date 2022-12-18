import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { pink } from '@mui/material/colors'

export default function LikeIcon({ likeStatus }) {
  if (likeStatus === true) {
    return (
      <Favorite
        sx={{
            color: pink[600]
        }}
      />
    )
  }
  else {
    return (
      <FavoriteBorder 
      sx={{
        color: pink[800]
      }}
      />
    )
  }
}
