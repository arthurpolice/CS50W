import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import Image from 'next/image'

export default function CatalogItem({ recipe }) {
  return (
    <Card
      className={'card'} 
      sx={{ maxWidth: 345 }}
    >
      <CardMedia
        component='img'
        alt={recipe.name}
        height={250}
        image={recipe.image}
      />
      <CardContent>
        <Typography variant='h5' component='div'>{recipe.name}</Typography>
        <Typography variant='body2' color='text.secondary'>
          <span>Servings: {recipe.total_servings}</span>
          <span>{Math.round(recipe.calories / recipe.total_servings)} kcal/serving</span>
          <span>{recipe.vegetarian?<Image src={'/images/no-meat.png'} alt='vegetarian' height={32} width={32}/>:<></>}</span>
          <span>{recipe.vegan?<FontAwesomeIcon icon="fa-sharp fa-solid fa-seedling" alt='vegan'/>:<></>}</span>
          <span>{recipe.dairy_free?<Image src={'/images/dairy-free.png'} alt='dairy free' height={32} width={32}/>:<></>}</span>
        </Typography>
      </CardContent>
    </Card>
  )
}