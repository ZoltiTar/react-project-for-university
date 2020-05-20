import React from "react";
import {Form} from "react-bootstrap";
import DatePicker from "react-datepicker";

const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

const DateDayPicker = (props) => {
    return (
        <>
            <Form.Label style={props.style}><h3>Date</h3></Form.Label>
            <DatePicker
                className={"form-control text-right"}
                minDate={new Date()}
                filterDate={isWeekday}
                highlightDates={props.highlights}
                dateFormat="MMMM do, yyyy"
                selected={props.date}
                value={props.date}
                onChange={props.onChangeFunction}
            />
        </>)
};

export {DateDayPicker, isWeekday};