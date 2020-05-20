import dispatcher from "../Dispatcher";

class IssueActions {
    getIssues() {
        dispatcher.handleViewAction({
            commandType : 'GET_ISSUES'
        })
    }
}

export default new IssueActions();