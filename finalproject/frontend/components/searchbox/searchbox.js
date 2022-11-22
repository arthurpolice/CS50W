import { TextField } from "@mui/material";
import styles from './searchbox.module.css'

export default function SearchBox({ setSearchField }) {
  return <div className={styles.searchDiv}>
    <TextField
      className={styles.searchBox}
      variant='standard'
      type='search'
      label='Search Catalog'
      onChange={(event) => setSearchField(event.target.value)} />
  </div>;
}