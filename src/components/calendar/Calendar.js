import './Calendar.css'
import React, { useEffect, useState } from 'react'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

function ServerDay(props) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    //console.log(props.highlightedDays);
    const isSelected = highlightedDays.find((date) => props.day.$D === date.$D && props.day.$M === date.$M && props.day.$y === date.$y);
  
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '🌚' : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    );
  }

const Calendar = ({tasks}) => {
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [value, setValue] = React.useState(dayjs());

    useEffect(() => {
        if (tasks) {
            const aux = tasks.map(task => dayjs(task.startDateTime));
            setHighlightedDays(aux);
        }
      },[]);

    if (!tasks) {
        return (
            <div>
                <div> No tasks available. </div>

                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar value={value} onChange={(newValue) => setValue(newValue)} readOnly />
                    </LocalizationProvider>
                    
                </div>
            </div>
            
        )

    }

    else {
        //console.log({tasks}); 


        return (
        
            <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={value} onChange={(newValue) => setValue(newValue)}
                        renderLoading={() => <DayCalendarSkeleton />}
                        slots={{
                            day: ServerDay,
                        }}
                        slotProps={{
                            day: {
                                highlightedDays,
                            },
                        }}
                    />
                </LocalizationProvider>
                
            </div>
        );
    }
};

export default Calendar;