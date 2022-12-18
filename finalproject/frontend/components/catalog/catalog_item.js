import { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { Grid, Grow } from '@mui/material'
import { parseCookies } from 'nookies'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import styles from './catalog.module.css'
import LikeButton from '../like_button/like_button'
import 'tachyons'

export default function CatalogItem({ recipe }) {
  const cookies = parseCookies()
  const token = cookies.token

  library.add(faSeedling)

  const [likesAmount, setLikesAmount] = useState(recipe.likesAmount)

  return (
    <Grow in={true} timeout={1000}>
      <Grid className={styles.catalogitem}>
        <Card className={styles.card} sx={{ maxWidth: 345 }}>
          <Link href={`/recipes/${recipe.id}`}>
            <CardMedia
              className={`${styles.cardMedia} ${'grow'}`}
              component='img'
              alt={recipe.name}
              height={250}
              image={
                recipe.image ? recipe.image : '/images/healthy-food-icon.png'
              }
            />
          </Link>
          <CardContent className={styles.content}>
            <Link href={`/recipes/${recipe.id}`}>
              <Typography className={styles.title} variant='h6' component='div'>
                {recipe.name}
              </Typography>
            </Link>
            <div className={styles.info}>
              <Typography variant='body2' color='text.secondary'>
                Servings: {recipe.total_servings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {Math.round(recipe.calories / recipe.total_servings)}{' '}
                kcal/serving
              </Typography>
            </div>
            <br />
            <div className={styles.footer}>
              <div>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  className={styles.source}
                >
                  By {recipe.credit}
                </Typography>
              </div>
              <div className={styles.restrictions}>
                <span className={styles.restriction}>
                  {recipe.vegetarian ? (
                    <Image
                      src={'/images/no-meat.png'}
                      alt='vegetarian'
                      title='Vegetarian'
                      height={24}
                      width={24}
                    />
                  ) : (
                    <></>
                  )}
                </span>
                <span className={styles.restriction}>
                  {recipe.vegan ? (
                    <span title='Vegan'>
                      <FontAwesomeIcon
                        icon={faSeedling}
                        color='green'
                        alt='vegan'
                      />
                    </span>
                  ) : (
                    <></>
                  )}
                </span>
                <span className={styles.restriction}>
                  {recipe.dairy_free ? (
                    <Image
                      src={'/images/dairy-free.png'}
                      alt='dairy free'
                      title='Dairy Free'
                      height={24}
                      width={24}
                    />
                  ) : (
                    <></>
                  )}
                </span>
              </div>
            </div>
            <div className={styles.likeSection} title='Likes'>
              <LikeButton
                recipe={recipe}
                token={token}
                likesAmount={likesAmount}
                setLikesAmount={setLikesAmount}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grow>
  )
}
