import EventEmitter from 'events';
import dispatcher from "../Dispatcher";
import axios from 'axios';

const DATABASE_URL = 'http://localhost:3001/';
const ENDPOINT = 'clerks';

class ClerkStore extends EventEmitter {
    _clerks = [];

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

const clerkStore = new ClerkStore();

dispatcher.register((action) => {
    let url = DATABASE_URL + ENDPOINT + '?';
    if(action.command.commandType === 'GET_CLERKS') {
        axios.get(url)
            .then((response) => {
                clerkStore._clerks = response.data;
                clerkStore.emitChange();
            })
            .catch((err) => {
                console.log(err);
            })
    }
});

export default clerkStore;