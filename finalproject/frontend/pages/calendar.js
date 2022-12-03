import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import Paper from '@mui/material/Paper';
import styles from '../styles/calendarpage.module.css'
import Navbar from '../components/navbar/navbar';
import Head from 'next/head';
import { useTokenStore } from '../lib/store'
import Meals from '../components/calendar/meals';


export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const token = useTokenStore(state => state.token)

  return (
    <div className='app'>
      <Head>
        <title>Calendar</title>
      </Head>
      <Navbar />
      <div className={styles.calendarDiv}>
        <Paper elevation={3} className={styles.paper}>
          <div className={styles.infoDisplay}>
            <Meals date={date} token={token} />
          </div>
          <Calendar onChange={setDate} value={date} />
        </Paper>
      </div>
    </div>
  );
}