import React from "react";
import {compareDatesWithoutTime, DateDayPicker} from "../datepicker/DateDayPicker";
import {Form} from "react-bootstrap";
import appointmentStore from "../../store/AppointmentStore";
import AppointmentActions from "../../actions/AppointmentActions";
import AppointmentView from "./AppointmentView";
import issueStore from "../../store/IssueStore";
import IssueActions from "../../actions/IssueActions";

export default class AppointmentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clerkId: props.clerkId,
            appointments: [],
            appointmentsForDate: [],
            date: new Date('2020-08-17T00:00:00'),
            issues: []
        };
        AppointmentActions.getAppointments(this.state.clerkId);
        IssueActions.getIssues();
        this.onChangeOfAppointmentList = this.onChangeOfAppointmentList.bind(this);
        this.onChangeOfIssuesList = this.onChangeOfIssuesList.bind(this);
    }

    generateAppointmentsForDate = () => {
        return this.state.appointments.filter(app => compareDatesWithoutTime(new Date(app.date), this.state.date));
    };

    handleDateChange = (date) => {
        AppointmentActions.getAppointments(this.state.clerkId);
        this.setState({date, appointmentsForDate: this.generateAppointmentsForDate()});
    };

    onChangeOfAppointmentList() {
        let appointments = appointmentStore._appointments;
        this.setState({appointments, appointmentsForDate: this.generateAppointmentsForDate()});
    }

    componentDidMount() {
        appointmentStore.addChangeListener(this.onChangeOfAppointmentList);
        issueStore.addChangeListener(this.onChangeOfIssuesList);
    }

    componentWillUnmount() {
        appointmentStore.removeChangeListener(this.onChangeOfAppointmentList);
        issueStore.removeChangeListener(this.onChangeOfIssuesList);
    }

    onChangeOfIssuesList() {
        let issues = issueStore._issues;
        this.setState({issues});
    }

    render() {
        return (
            <Form className={"container my-2"}>
                <Form.Group>
                    <div><em>Select a date below to see appointments for that day.</em></div>
                    <DateDayPicker date={this.state.date} onChangeFunction={this.handleDateChange}
                                   style={{paddingRight: '2em'}}
                                   highlights={this.state.appointments}/>
                    {this.state.appointmentsForDate.length === 0 &&
                    <h4 className={'mx-3'}>No appointments for this day 🤗</h4>}
                    {this.state.appointmentsForDate.length > 0 &&
                    <>
                        <div className={'px-5'}>
                            {this.state.appointmentsForDate.length} appointments for this day.
                        </div>
                        {this.state.appointmentsForDate.map((appointment) => {
                            return (
                                <AppointmentView
                                    appointment={appointment}
                                    issues={this.state.issues.filter(issue => {
                                        if (appointment.issues.includes(issue.id)) {
                                            return issue;
                                        }
                                    })
                                    }
                                />)
                        })}
                    </>
                    }
                </Form.Group>
            </Form>
        )
    }
}