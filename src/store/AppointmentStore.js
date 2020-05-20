import EventEmitter from 'events';
import dispatcher from "../Dispatcher";
import axios from 'axios';
import clerkStore from "./ClerkStore";
import ClerkActions from "../actions/ClerkActions";

const DATABASE_URL = 'http://localhost:3001/';
const ENDPOINT = 'appointments';

function onChangeOfClerkList() {
    this.clerks = clerkStore._clerks;
}

class AppointmentStore extends EventEmitter {
    _appointments = [];
    clerks = [];
    booked = {};

    constructor() {
        super();
        ClerkActions.getClerks();
        this.onChangeOfClerkList = onChangeOfClerkList.bind(this);
        clerkStore.addChangeListener(this.onChangeOfClerkList);
    }

    emitChange() {
        this.emit('change');
    }

    addChangeListener(callback) {
        this.addListener('change', callback);
    }

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

}

const appointmentStore = new AppointmentStore();

dispatcher.register((action) => {
    let url = DATABASE_URL + ENDPOINT;
    if (action.command.commandType === 'GET_APPOINTMENTS') {
        url = url + '?';
        if (action.command.clerkId !== undefined) {
            url = url + `clerkId=${action.command.clerkId}`;
        }
        if (action.command.date !== undefined) {
            url = url + `clerkId=${action.command.date}`;
        }
        axios.get(url)
            .then((response) => {
                appointmentStore._appointments = response.data;
                appointmentStore.emitChange();
            })
            .catch((err) => {
                console.log(err);
            })
    } else if (action.command.commandType === 'BOOK_APPOINTMENT') {
        let appointment = action.command.appointment;
        appointment.id = Math.floor(Math.random() * (1000 - 101)) + 101;
        let i = 0;
        while (appointment.clerkId === undefined && i < appointmentStore.clerks.length) {
            console.log(appointmentStore.clerks[i]);
            let clerkId = appointmentStore.clerks[i].id;
            if (appointmentStore._appointments.filter(appmt => appmt.date === appointment.date).length === 0) {
                appointment.clerkId = clerkId;
            }
            i++;
        }
        console.log(appointment.clerkId);
        axios.post(url, appointment)
            .then((response) => {
                    const date = new Date(response.data.date).toLocaleString('en-US').replace(':00 AM', ' AM').replace(':00 PM', ' PM');
                    console.log(response.data);
                    const clerk = appointmentStore.clerks.find(clerk => clerk.id === response.data.clerkId);
                    appointmentStore.booked = {
                        show: true,
                        variant: "success",
                        message: `Appointment booked successfully for ${date} and your clerk will be ${clerk.name}.`
                    };
                    appointmentStore.emitChange();
                }
            ).catch((err) => {
                appointmentStore.booked = {
                    show: true,
                    variant: "danger",
                    message: "Something happened, please try again later",
                };
                appointmentStore.emitChange();
                console.log(err);
            }
        );
    }
});

export default appointmentStore;