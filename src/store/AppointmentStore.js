import EventEmitter from 'events';
import dispatcher from "../Dispatcher";
import axios from 'axios';
import clerkStore from "./ClerkStore";

const DATABASE_URL = 'http://localhost:3001/';
const ENDPOINT = 'appointments';

function onChangeOfClerkList() {
    this.clerks = clerkStore._clerks;
}

class AppointmentStore extends EventEmitter {
    _appointments = [];
    clerks = [];

    constructor() {
        super();
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
        appointment.clerkId = 801;
        appointment.id = Math.floor(Math.random() * (1000 - 101)) + 101;
        axios.post(url, appointment)
            .then((response) => {
                    console.log(response);
                }
            ).catch((err) => {
                console.log(err);
            }
        );
        appointmentStore.emitChange();
    }
});

export default appointmentStore;