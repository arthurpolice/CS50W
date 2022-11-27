import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Select, MenuItem, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import MiniCalendar from './minicalendar';
import styles from './modal.module.css';
import { InputLabel } from '@mui/material';

export default function BasicModal( { open, handleClose } ) {
  
  function isNumeric(value) {
    return /^\d+$/.test(value);
  }

  const [style, setStyle] = useState({})
  const [meal, setMeal] = useState('')
  const [day, setDay] = useState({})
  const [servings, setServings] = useState(1)

  const handleServingsChange = event => {
    if (isNumeric(event.target.value) === true) {
      setServings(Math.round(parseInt(event.target.value)))
    }
  }

  useEffect(() => {
    setStyle(prevState => ({
      ...prevState,
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '0px solid #000',
      boxShadow: 24,
      borderRadius: 1,
      p: 4
    })
  )}, [])

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className={styles.boxDiv}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              When will you eat this?
            </Typography>
            <MiniCalendar day={ day } setDay={ setDay }/>
            <InputLabel id="demo-simple-select-label">Meal</InputLabel>
            <Select
              className={styles.mealFields}
              value={meal}
              onChange={event => setMeal(event.target.value)}>
                <MenuItem value={'bf'}>Breakfast</MenuItem>
                <MenuItem value={'lun'}>Lunch</MenuItem>
                <MenuItem value={'din'}>Dinner</MenuItem>
                <MenuItem value={'extra'}>Extra</MenuItem>
            </Select>
            <InputLabel>Servings</InputLabel>
            <TextField 
              className={styles.servings}
              defaultValue={servings}
              onChange={(event) => handleServingsChange(event)}  
            />
          </div>
          <div className={styles.buttonDiv}>
            <Button>Add</Button>
          </div>
        </Box>
      </Modal>
  );
}
