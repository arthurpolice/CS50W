import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import Login from './login'
import { Typography } from '@mui/material';
import styles from './modal.module.css'
import Image from 'next/image';

export default function LoginModal( { open, handleClose } ) {

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
          <div className={styles.row}>
            <Image src={'/images/icon.png'} alt='logo' width={48} height={48}/>
          </div>
          <Typography variant='h5' className={styles.heading}>Please Log In</Typography>
          <Login handleClose={handleClose}/>
        </Box>
      </Modal>
  );
}
