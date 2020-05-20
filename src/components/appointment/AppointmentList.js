import React from "react";
import {DateDayPicker} from "../datepicker/DateDayPicker";
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

    compareDatesWithoutTime(d1, d2) {
        const date1 = new Date(d1).setHours(0, 0, 0, 0);
        const date2 = new Date(d2).setHours(0, 0, 0, 0);
        return date1 === date2;
    }

    handleDateChange = (date) => {
        AppointmentActions.getAppointments(this.state.clerkId);
        let st = this.state;
        st.date = date;
        st.appointmentsForDate = st.appointments.filter(app => this.compareDatesWithoutTime(new Date(app.date), st.date));
        this.setState(st);
    };

    onChangeOfAppointmentList() {
        let st = this.state;
        st.appointments = appointmentStore._appointments;
        st.appointmentsForDate = st.appointments.filter(app => this.compareDatesWithoutTime(new Date(app.date), st.date));
        this.setState(st);
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
        let st = this.state;
        st.issues = issueStore._issues;
        this.setState(st);
    }

    render() {
        return (
            <Form className={"container my-2"}>
                <Form.Group>
                    <div><em>Select a date below to see appointments for that day.</em></div>
                    <DateDayPicker date={this.state.date} onChangeFunction={this.handleDateChange}
                                   style={{paddingRight: '2em'}}
                                   highlights={
                                       [...new Set(this.state.appointments.map(appmt => {
                                           return new Date(appmt.date).setHours(0, 0, 0, 0);
                                       }))].map(date => {
                                           return {
                                               date: new Date(date),
                                               count: this.state.appointments.reduce(
                                                   (total, curr) => {
                                                       return total + this.compareDatesWithoutTime(new Date(date), new Date(curr.date)) ? 1 : 0;
                                                   }, 0)
                                           }
                                       })
                                   }/>
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