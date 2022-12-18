import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  TextField,
  Radio,
  FormGroup,
  Checkbox,
} from '@mui/material'
import styles from './header.module.css'


export default function Header({
  fieldChange,
  setMeasuringSystem,
  checkboxChange,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.subHeader}>
        <TextField
          required
          className={styles.recipeName}
          name='title'
          variant='standard'
          label='Recipe Title'
          onChange={fieldChange}
        />
        <TextField
          className={styles.recipeName}
          name='image'
          variant='standard'
          label='Image URL for your Recipe'
          onChange={fieldChange}
        />
      </div>
      <div className={styles.subHeader}>
        <TextField
          required
          className={styles.servings}
          name='servings'
          variant='standard'
          label='Servings'
          onChange={fieldChange}
        />
        <TextField
          className={styles.recipeName}
          name='sourceUrl'
          variant='standard'
          label='Source URL'
          onChange={fieldChange}
        />
      </div>
      <FormControl className={styles.form}>
        <FormLabel>Measuring System</FormLabel>
        <RadioGroup
          name='measuringsys'
          defaultValue='metric'
          className={styles.buttons}
        >
          <FormControlLabel
            value='metric'
            control={<Radio />}
            label='Metric'
            onChange={(event) => setMeasuringSystem(event.target.value)}
          />
          <FormControlLabel
            value='us'
            control={<Radio />}
            label='Imperial (US)'
            onChange={(event) => setMeasuringSystem(event.target.value)}
          />
        </RadioGroup>
      </FormControl>
      <FormGroup className={styles.buttons}>
        <FormControlLabel
          control={<Checkbox />}
          name='vegetarian'
          label='Vegetarian'
          onChange={checkboxChange}
        />
        <FormControlLabel
          control={<Checkbox />}
          name='vegan'
          label='Vegan'
          onChange={checkboxChange}
        />
        <FormControlLabel
          control={<Checkbox />}
          name='dairyFree'
          label='Dairy Free'
          onChange={checkboxChange}
        />
        <FormControlLabel
          control={<Checkbox />}
          name='ketogenic'
          label='Ketogenic'
          onChange={checkboxChange}
        />
        <FormControlLabel
          control={<Checkbox />}
          name='glutenFree'
          label='Gluten Free'
          onChange={checkboxChange}
        />
      </FormGroup>
    </div>
  )
}
