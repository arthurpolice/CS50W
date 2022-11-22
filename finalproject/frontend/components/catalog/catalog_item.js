import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { Grid } from '@mui/material'
import styles from './catalog.module.css'
import 'tachyons'
import { useRouter } from 'next/router'




export default function CatalogItem({ recipe }) {
  const router = useRouter()
  return (
      <Grid className={styles.catalogitem}>
          <Card className={`${styles.card} ${'grow'}` } sx={{ maxWidth: 345 }} onClick={() => router.push(`recipes/${recipe.id}`)}>
            <CardMedia
              component='img'
              alt={recipe.name}
              height={250}
              image={recipe.image}
            />
            <CardContent className={styles.content}>
              <Typography className={styles.title} variant='h6' component='div'>
                {recipe.name}
              </Typography>
              <div className={styles.info}>
                <Typography variant='body2' color='text.secondary'>
                  Servings: {recipe.total_servings}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {Math.round(recipe.calories / recipe.total_servings)} kcal/serving
                </Typography>
              </div>
              <br />
              <div className={styles.footer}>
                <div>
                  <Typography variant='body2' color='text.secondary' className={styles.source}>By {recipe.credit}</Typography>
                </div>
                <div className={styles.restrictions}>
                  <span>
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
                  <span>
                    {recipe.vegan ? (
                      <FontAwesomeIcon
                        icon='fa-sharp fa-solid fa-seedling'
                        alt='vegan'
                        title='Vegan'
                      />
                    ) : (
                      <></>
                    )}
                  </span>
                  <span>
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
            </CardContent>
          </Card>
      </Grid>
  )
}
