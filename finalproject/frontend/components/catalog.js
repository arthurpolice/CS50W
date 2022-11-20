import CatalogItem from "./catalog_item"

export default function Catalog({ recipeCatalog }) {
  return (
    recipeCatalog.list.map((recipe) => {
      return <CatalogItem key={recipe.url} recipe={recipe} />
    }) 
  )
}