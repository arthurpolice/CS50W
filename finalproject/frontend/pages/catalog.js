import { getRecipeCatalog } from '../lib/catalog'
import CatalogItem from '../components/catalog_item';
import Catalog from '../components/catalog';
import styles from '../styles/catalog.module.css'

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
  return (
    <div className={styles.catalog}>
      <Catalog recipeCatalog={recipeCatalog}/>
    </div>
  )
}