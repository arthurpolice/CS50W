import { getRecipeCatalog } from '../lib/catalog'
import Catalog from '../components/catalog';
import styles from '../styles/catalog.module.css'
import { Grid, TextField } from '@mui/material';
import { useState } from 'react';

export async function getStaticProps() {
  const recipeCatalog = await getRecipeCatalog();

  return {
    props: {
      recipeCatalog,
    },
    revalidate: 60,
  };
}

export default function CatalogPage({ recipeCatalog }) {
  const [searchField, setSearchField] = useState('')
  const filteredRecipes = recipeCatalog.list.filter(entry => {
    return entry.name.toLowerCase().includes(searchField)
  })
  return (
    <>
    <div className={styles.searchDiv}>
      <TextField
        className={styles.searchBox} 
        variant='standard'
        type='search' 
        label='Search Catalog' 
        onChange={(event) => setSearchField(event.target.value) }
      />
    </div>
    <Grid container className={styles.catalog}>
      <Catalog recipeCatalog={filteredRecipes}/>
    </Grid>
    </>
  )
}