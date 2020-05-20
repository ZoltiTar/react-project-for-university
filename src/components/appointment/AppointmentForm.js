import React from 'react';
import {Button, Col, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class AppointmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: "",
                date: new Date(),
                issues: []
            },
            reservedTimes: props.reservedTimes
        }
    }

    handleDateChange = (date) => {
        let st = this.state;
        st.form.date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        this.setState(st);
    };

    handleTimeChange = (date) => {
        let st = this.state;
        st.form.date.setHours(date.getHours(), date.getMinutes(), 0);
        this.setState(st);
        console.log(st);
    };

    handleIssueChange = (e) => {
        if (e.target.checked === true) {
            let st = this.state;
            st.form.issues.push(e.target.value);
            this.setState(st);
        } else {
            let st = this.state;
            let index = st.form.issues.indexOf(e.target.value);
            st.form.issues.splice(index, 1);
            this.setState(st);
        }
    };

    isWeekday = (date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    setFirstAvailableDate = (date) => {
        date.setDate(16);
        const nineToday = new Date(date).setHours(9, 0, 0);
        const fiveToday = new Date(date).setHours(17, 0, 0);
        if (this.isWeekday(date) && date > nineToday && date < fiveToday) {
            const minutes = date.getMinutes() < 30 ? 30 : 0;
            const hours = minutes === 0 ? date.getHours() + 1 : date.getHours();
            date.setHours(hours, minutes, 0);
        }
        if (this.isWeekday(date) && date < nineToday) {
            date.setHours(9, 0, 0);
        }
        if (date.getDay() < 5 && date > fiveToday) {
            date.setDate(date.getDate() + 1);
            date.setHours(9, 0, 0);
        }
        if (date.getDay() > 4) {
            let plusDays = 7 - date.getDay() + 1;
            let dt = date.getDate() + plusDays;
            date.setDate(dt);
            date.setHours(9, 0, 0);
        }
    };

    componentDidMount() {
        this.setFirstAvailableDate(this.state.form.date);
        this.setState(this.state.form.date);
    }

    render() {
        return (
            <Form className={"container"}>
                <Form.Row className={'justify-content-center'}>
                    <Col md lg={{span: 4}}>
                        <Form.Label style={{display: "block"}}>Name</Form.Label>
                        <Form.Control type="text"/>
                    </Col>
                    <Col md lg={{span: 2, offset: 1}} className={"text-right"}>
                        <Form.Label style={{display: "block"}}>Date</Form.Label>
                        <DatePicker className={"form-control text-right"} minDate={new Date()}
                                    filterDate={this.isWeekday}
                                    dateFormat="MMMM do, yyyy"
                                    selected={this.state.form.date} value={this.state.form.date}
                                    onChange={this.handleDateChange}/>
                    </Col>
                    <Col md lg={{span: 1}} className={"text-right"}>
                        <Form.Label style={{display: "block"}}>Time</Form.Label>
                        <DatePicker showTimeSelect showTimeSelectOnly className={"form-control text-right"}
                                    disabledKeyboardNavigation dateFormat="hh:mm"
                                    selected={this.state.form.date} value={this.state.form.date}
                                    minTime={this.state.form.date}
                                    maxTime={new Date(this.state.form.date).setHours(16, 45)}
                                    onChange={this.handleTimeChange}/>
                    </Col>
                </Form.Row>
                <Form.Row className={"justify-content-center"}>
                    <Col md lg={{span: 4}} className={"text-left"}>
                        <Form.Label>Issues</Form.Label>
                        <Form.Check type={'checkbox'} id={'issue-0'} value={0} label={'Marriage'}
                                    onChange={this.handleIssueChange}/>
                        <Form.Check type={'checkbox'} id={'issue-1'} value={1} label={'Birth certificate'}
                                    onChange={this.handleIssueChange}/>
                        <Form.Check type={'checkbox'} id={'issue-2'} value={2} label={'Renew driver\'s license'}
                                    onChange={this.handleIssueChange}/>
                    </Col>
                    <Col md lg={{span: 4}} className={"text-right"}>
                        <Form.Label>Required documents for selected issues</Form.Label>
                        <ul>
                            <li>Marriage: ID card, birth certificate</li>
                            <li>Birth certificate: ID card</li>
                        </ul>
                    </Col>
                </Form.Row>
                <Form.Row className={"justify-content-center"}>
                    <Col md lg={{span: 8}} className={'text-right'}>
                        <div style={{display: 'inline'}}>Estimated time required: <span className={'text-warning'}>15 minutes</span>
                        </div>
                        <Button className={'mx-2'} variant={'primary'}>Save!</Button>
                    </Col>
                </Form.Row>
            </Form>
        )
    }
}

export default AppointmentForm;