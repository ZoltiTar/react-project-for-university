import React from "react";
import {Form} from "react-bootstrap";
import DatePicker from "react-datepicker";

const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

const compareDatesWithoutTime = (d1, d2) => {
    const date1 = new Date(d1).setHours(0, 0, 0, 0);
    const date2 = new Date(d2).setHours(0, 0, 0, 0);
    return date1 === date2;
};

const createHighlights = (appointments) => {
    const datesWithCount = [...new Set(appointments.map(appmt => {
        return new Date(appmt.date).setHours(0, 0, 0, 0);
    }))].map(date => {
        return {
            date: new Date(date),
            count: appointments.reduce(
                (total, curr) => {
                    return total + (compareDatesWithoutTime(new Date(date), new Date(curr.date)) ? 1 : 0);
                }, 0)
        }
    });
    return [
        {'bg-success text-light': datesWithCount.filter(hl => hl.count < 2 && hl.count !== 0).map(hl => hl.date)},
        {'bg-warning text-dark': datesWithCount.filter(hl => hl.count > 1 && hl.count < 3).map(hl => hl.date)},
        {'bg-danger text-light': datesWithCount.filter(hl => hl.count > 2).map(hl => hl.date)}
    ]
};

const DateDayPicker = (props) => {
    let colored = [];
    if (props.highlights !== undefined) {
        colored = createHighlights(props.highlights);
    }
    return (
        <>
            <Form.Label style={props.style}><h3>Date</h3></Form.Label>
            <DatePicker
                className={"form-control text-right"}
                minDate={new Date()}
                filterDate={isWeekday}
                highlightDates={colored}
                dateFormat="MMMM do, yyyy"
                selected={props.date}
                value={props.date}
                onChange={props.onChangeFunction}
            />
        </>)
};

export {DateDayPicker, isWeekday, compareDatesWithoutTime};