import { Autocomplete, TextField } from '@mui/material'
import styles from './number_select.module.css'

export default function NumberSelect({
  num,
  unit = null,
  decimalSlots,
  variableName,
  setVariable,
}) {
  const keyArray = [...Array(num).keys()]
  // This is used to unify usage of this for both integers and floats
  if (decimalSlots > 0) {
    var optionArray = keyArray.map((item) =>
      (item / (10 * decimalSlots)).toString()
    )
  } else {
    var optionArray = keyArray.map((item) => item.toString())
  }
  const labelUnit = unit ? `(${unit})` : ''
  const word = variableName[0].toUpperCase()
  const firstLetter = word.charAt(0)
  const restOfWord = word.slice(1).toLowerCase()
  const label = firstLetter + restOfWord

  // Autocomplete value giving trouble, this is a workaround.
  const handleChange = event => {
    if (event.target.value === 0) {
      console.log('used text content')
      setVariable(event.target.textContent)
    }
    else {
      console.log('used value')
      setVariable(event.target.value)
    }
  }

  return (
    <Autocomplete
      className={styles.field}
      options={optionArray}
      autoComplete={true}
      autoHighlight={true}
      required
      autoSelect={true}
      clearOnEscape
      name={variableName}
      onClose={handleChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`${label} ${labelUnit}`}
          variant='standard'
        />
      )}
    />
  )
}
