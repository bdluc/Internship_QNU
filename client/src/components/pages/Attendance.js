import React from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import './dist/stylesCalendar.css';

//https://github.com/patientslikeme/react-calendar-heatmap


const AttendancePage = () => {
  return (
    <React.Fragment>
      <div >
        <CalendarHeatmap
          startDate={new Date('2019-01-01')}
          endDate={new Date('2019-05-19')}
          values={[
            { date: '2019-02-01', count: 6 },
            { date: '2019-03-22' },
            { date: '2019-02-30' },
            // ...and so on
          ]} />

      </div>
    </React.Fragment>
  )
}

export default AttendancePage