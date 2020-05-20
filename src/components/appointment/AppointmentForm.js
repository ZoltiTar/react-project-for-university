import React from 'react';
import {Alert, Button, Col, Form, Row} from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import {DateDayPicker, isWeekday} from "../datepicker/DateDayPicker";
import DateTimePicker from "../datepicker/DateTimePicker";
import IssueActions from "../../actions/IssueActions";
import issueStore from "../../store/IssueStore";
import AppointmentActions from "../../actions/AppointmentActions";
import appointmentStore from "../../store/AppointmentStore";

class AppointmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                name: "",
                date: new Date(),
                issues: []
            },
            issues: [],
            appointments: [],
            booked: {}
        };
        AppointmentActions.getAppointments();
        IssueActions.getIssues();
        this.onChangeOfAppointmentList = this.onChangeOfAppointmentList.bind(this);
        this.onChangeOfIssuesList = this.onChangeOfIssuesList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange = (e) => {
        let st = this.state;
        st.form.name = e.target.value;
        this.setState(st);
    };

    handleDateChange = (date) => {
        let st = this.state;
        st.form.date.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        this.setState(st);
    };

    handleTimeChange = (date) => {
        let st = this.state;
        st.form.date.setHours(date.getHours(), date.getMinutes(), 0, 0);
        this.setState(st);
    };

    handleIssueChange = (e) => {
        let st = this.state;
        if (e.target.checked === true) {
            st.form.issues.push(+e.target.value);
            this.setState(st);
        } else {
            let index = st.form.issues.indexOf(+e.target.value);
            st.form.issues.splice(index, 1);
        }
        this.setState(st);
    };

    setFirstAvailableDate = (date) => {
        const nineToday = new Date(date).setHours(9, 0, 0);
        const fiveToday = new Date(date).setHours(17, 0, 0);
        if (isWeekday(date) && date > nineToday && date < fiveToday) {
            const minutes = date.getMinutes() < 30 ? 30 : 0;
            const hours = minutes === 0 ? date.getHours() + 1 : date.getHours();
            date.setHours(hours, minutes, 0, 0);
        }
        if (isWeekday(date) && date < nineToday) {
            date.setHours(9, 0, 0, 0);
        }
        if (date.getDay() < 5 && date > fiveToday) {
            date.setDate(date.getDate() + 1);
            date.setHours(9, 0, 0, 0);
        }
        if (date.getDay() > 4) {
            let plusDays = 7 - date.getDay() + 1;
            let dt = date.getDate() + plusDays;
            date.setDate(dt);
            date.setHours(9, 0, 0, 0);
        }
    };

    onChangeOfAppointmentList() {
        let st = this.state;
        st.appointments = appointmentStore._appointments;
        st.booked = appointmentStore.booked;
        this.setState(st);
        this.forceUpdate();
    }

    onChangeOfIssuesList() {
        let st = this.state;
        st.issues = issueStore._issues;
        this.setState(st);
    }

    componentDidMount() {
        appointmentStore.addChangeListener(this.onChangeOfAppointmentList);
        issueStore.addChangeListener(this.onChangeOfIssuesList);
        this.setFirstAvailableDate(this.state.form.date);
    }

    componentWillUnmount() {
        issueStore.removeChangeListener(this.onChangeOfIssuesList);
        appointmentStore.removeChangeListener(this.onChangeOfAppointmentList);
    }

    handleSubmit(e) {
        e.preventDefault();
        let appointment = {...this.state.form};
        appointment.date = appointment.date.toISOString();
        AppointmentActions.bookAppointment(appointment);
        this.setState({booked: appointmentStore.booked});
    }

    render() {
        return (
            <div className={"container my-2"}>
                <Form onSubmit={this.handleSubmit}>
                    <Row className={'justify-content-center'}>
                        <Col md lg={{span: 10}}>
                            <h1>Book an appointment</h1>
                        </Col>
                    </Row>
                    <Form.Row className={'justify-content-center'}>
                        <Col md lg={{span: 5}}>
                            <Form.Label style={{display: "block"}}><h3>Name</h3></Form.Label>
                            <Form.Control placeholder={"John Doe/Jane Doe"} type="text"
                                          onChange={this.handleNameChange}/>
                        </Col>
                        <Col md lg={{span: 2, offset: 2}}>
                            <DateDayPicker date={this.state.form.date} onChangeFunction={this.handleDateChange}
                                           style={{display: "block"}} highlights={this.state.appointments}/>
                        </Col>
                        <Col md lg={{span: 1}}>
                            <DateTimePicker date={this.state.form.date} onChangeFunction={this.handleTimeChange}
                                            style={{fontSize: '0.8em'}}/>
                        </Col>
                    </Form.Row>
                    <Form.Row className={"justify-content-center"}>
                        <Col md lg={{span: 10}} className={"text-left"}>
                            <h3>Issues</h3>
                        </Col>
                        <Col md lg={{span: 8}} className={"text-left my-2"}>
                            {this.state.issues.map(iss => {
                                return <Form.Check inline type={'checkbox'} id={`issue-${iss.id}`} value={iss.id}
                                                   label={iss.issue}
                                                   onChange={this.handleIssueChange}/>
                            })}
                        </Col>
                    </Form.Row>
                    <Form.Row className={"justify-content-center"}>
                        <Col md lg={{span: 10}}>
                            <h4>Required documents for selected issues</h4>
                        </Col>
                        <Col md lg={{span: 8}}>
                            {this.state.issues.map(issue => {
                                if (this.state.form.issues.includes(issue.id)) {
                                    return <div>{issue.issue + ': ' + issue.documents.join(', ')}</div>;
                                }
                            })}
                        </Col>
                    </Form.Row>
                    <Form.Row className={"justify-content-center my-3"}>
                        <Col md lg={{span: 10}} className={'text-right'}>
                            <div style={{display: 'inline'}}>
                                <em>Estimated time required: </em>
                                <span className={'font-weight-bold text-warning'}>
                                {
                                    this.state.issues.reduce((acc, curr) =>
                                        acc + (this.state.form.issues.includes(curr.id) ? curr.est : 0)
                                        , 0)
                                } minutes
                            </span>
                            </div>
                        </Col>
                        <Col md lg={{span: 10}} className={'text-right'}>
                            <Button className={'px-5 my-2'} variant={'primary'} type={"submit"}>Book it!</Button>
                        </Col>
                    </Form.Row>
                </Form>
                {this.state.booked.show !== undefined && this.state.booked.show &&
                <Alert variant={this.state.booked.variant}>{this.state.booked.message}</Alert>
                }
            </div>
        )
    }
}

export default AppointmentForm;