import dispatcher from "../Dispatcher";

class AppointmentActions {
    bookAppointment(appointment) {
        dispatcher.handleViewAction({
            commandType: 'BOOK_APPOINTMENT',
            appointment
        })
    }

    getAppointments(clerkId) {
        dispatcher.handleViewAction({
            commandType: 'GET_APPOINTMENTS',
            clerkId
        })
    }

    getAppointmentsByDay(date) {
        dispatcher.handleViewAction({
            commandType: 'GET_APPOINTMENTS',
            date: new Date(date).toISOString().substring(0, 10)
        })
    }

}

export default new AppointmentActions();