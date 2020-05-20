import {Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import React from "react";

const DateTimePicker = (props) => {
    return (
        <>
            <Form.Label style={{display: "block"}}><h3>Time</h3></Form.Label>
            <DatePicker
                showTimeSelect
                showTimeSelectOnly
                className={"form-control text-right"}
                disabledKeyboardNavigation
                dateFormat="hh:mmaa"
                selected={props.date}
                value={props.date}
                minTime={props.date}
                maxTime={new Date(props.date).setHours(16, 45)}
                onChange={props.onChangeFunction}
            />
        </>
    )
};

export default DateTimePicker;