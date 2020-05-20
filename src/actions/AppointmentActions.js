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

}

export default new AppointmentActions();