import EventEmitter from 'events';
import dispatcher from "../Dispatcher";
import axios from 'axios';

const DATABASE_URL = 'http://localhost:3001/';
const ENDPOINT = 'issues';

class IssueStore extends EventEmitter {
    _issues = [];

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

const issueStore = new IssueStore();

dispatcher.register((action) => {
    if(action.command.commandType === 'GET_ISSUES') {
        let url = DATABASE_URL + ENDPOINT;

        axios.get(url)
            .then((response) => {
                issueStore._issues = response.data;
                issueStore.emitChange();
            })
            .catch((err) => {
                console.log(err);
            })
    }
});

export default issueStore;