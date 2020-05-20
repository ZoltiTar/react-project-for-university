import {Dispatcher} from 'flux';

class OfficeDispatcher extends Dispatcher {
    handleViewAction(action) {
        this.dispatch({
           actionType: 'VIEW_ACTION',
           command: action
        });
    }
}

const dispatcher = new OfficeDispatcher();

export default dispatcher;