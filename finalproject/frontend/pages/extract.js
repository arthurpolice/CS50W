import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { FormControl } from '@mui/material';
import { sendUrl } from '../lib/extractor';
import styles from '../styles/extract.module.css'
import LoadingButton from '@mui/lab/LoadingButton';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';


export default function ExtractPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  return (
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
          sendUrl(url, router)
          setLoading(true)
        }}
        startIcon={<DiningOutlinedIcon />}
      >
          Send
      </LoadingButton>
      </FormControl>
    </div>
  )
}



