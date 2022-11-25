import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { FormControl } from '@mui/material';
import { sendUrl } from '../lib/extractor';
import styles from '../styles/extract.module.css'
import LoadingButton from '@mui/lab/LoadingButton';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import Navbar from '../components/navbar/navbar';
import Head from 'next/head';

export default function ExtractPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLoading(url, router) {
    setLoading(true)
    try {
      sendUrl(url, router)
    }
    catch {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Extract Recipes</title>
        <meta name="description" content="recipe extractor" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navbar />
      <div className={styles.main}>
        <FormControl className={styles.form}>
        <TextField 
          id='url-extractor'
          label="Your recipe's URL"
          variant='standard'
          className={styles.urlextractor}
          onChange={(event) => setUrl(event.target.value)}
          />
        <LoadingButton
          loading={loading}
          loadingPosition='start'
          variant='text'
          onClick={() => {
            handleLoading(url, router)
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



