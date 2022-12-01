import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import MealModalContent from './meal_modal_content'

export default function MealModal( { open, handleClose, id } ) {

  const [style, setStyle] = useState({})

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
          <MealModalContent id={id}/>
        </Box>
      </Modal>
  );
}
