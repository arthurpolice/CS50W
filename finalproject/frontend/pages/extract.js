import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { FormControl } from '@mui/material';
import { sendUrl } from '../lib/extractor';
import styles from '../styles/extract.module.css'
import LoadingButton from '@mui/lab/LoadingButton';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import Navbar from '../components/navbar/navbar';
import Head from 'next/head';
import { useTokenStore, checkToken } from '../lib/store';
import LoginModal from '../components/login_modal/login_modal';

export default function ExtractPage() {
  const token = useTokenStore(state => state.token)
  const changeToken = useTokenStore(state => state.addToken)
  const route = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)

  async function handleLoading(url, route) {
    setLoading(true)
    sendUrl(url, route, token, changeToken, setErrorMessage, setLoading, handleOpen)
  }
  
  useEffect(()=> {
    if (!token || token === '') {
      handleOpen()
    }
  }, [token])

  return (
    <>
      <Head>
        <title>Extract Recipes</title>
        <meta name="description" content="recipe extractor" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navbar />
      <LoginModal open={openModal} handleClose={handleClose}/>
      <div className={styles.main}>
        <FormControl className={styles.form}>
        <TextField 
          id='url-extractor'
          label="Your recipe's URL"
          variant='standard'
          helperText={errorMessage}
          className={styles.urlextractor}
          onChange={(event) => setUrl(event.target.value)}
          />
        <LoadingButton
          loading={loading}
          loadingPosition='start'
          variant='text'
          onClick={() => {
            handleLoading(url, route)
          }}
          startIcon={<DiningOutlinedIcon />}
        >
            Send
        </LoadingButton>
        </FormControl>
      </div>
    </>
  )
}



