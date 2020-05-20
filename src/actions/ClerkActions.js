import dispatcher from "../Dispatcher";

class ClerkActions {
    getClerks() {
        dispatcher.handleViewAction({
            commandType : 'GET_CLERKS'
        })
    }
}

export default new ClerkActions();