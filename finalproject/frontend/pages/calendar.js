import { useState } from 'react';
import Calendar from 'react-calendar';
import Paper from '@mui/material/Paper';
import styles from '../styles/calendarpage.module.css'
import Navbar from '../components/navbar/navbar';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div className='app'>
      <Navbar />
      <div className={styles.calendarDiv}>
        <Paper elevation={3} className={styles.paper}>
          <div className={styles.infoDisplay}>
            <p className='text-center'>
              <span className='bold'>Selected Date:</span>{' '}
              {date.toDateString()}
            </p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
            <p>aaaaaaaaaaaaaaaaaaaaaaaaa</p>
          </div>
          <Calendar onChange={setDate} value={date} />
        </Paper>
      </div>
    </div>
  );
}