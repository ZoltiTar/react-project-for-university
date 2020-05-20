import React from 'react';
import './App.scss';
import AppointmentForm from "./components/appointment/AppointmentForm";
import Header from "./components/Header";
import AppointmentList from "./components/appointment/AppointmentList";
import {BrowserRouter, Route, Switch} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Switch>
                <Route path={"/"} exact component={AppointmentForm}/>
                <Route path={"/myAppointments"} exact component={() => <AppointmentList clerkId={660}/>}/>
                <Route path={"/manageAppointments"} exact component={() => <AppointmentList/>}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
