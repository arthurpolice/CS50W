import { getRecipeCatalog } from '../lib/catalog'
import Catalog from '../components/catalog/catalog';
import styles from '../styles/catalog.module.css'
import { Grid } from '@mui/material';
import { useState } from 'react';
import Navbar from '../components/navbar/navbar';
import SearchBox from '../components/searchbox/searchbox';

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
    <Navbar/>
    <SearchBox setSearchField={setSearchField} />
    <Grid container className={styles.catalog}>
      <Catalog recipeCatalog={filteredRecipes}/>
    </Grid>
    </>
  )
}
