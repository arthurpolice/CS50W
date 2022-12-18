import CatalogItem from './catalog_item'

export default function Catalog({ recipeCatalog }) {
  return recipeCatalog.map((recipe) => {
    return <CatalogItem key={recipe.url} recipe={recipe} />
  })
}
