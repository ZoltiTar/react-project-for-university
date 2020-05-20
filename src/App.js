import React from 'react';
import './App.scss';
import AppointmentForm from "./components/appointment/AppointmentForm";
import Header from "./components/Header";
import AppointmentList from "./components/appointment/AppointmentList";

function App() {
    return (
        <React.Fragment>
            <Header/>
            <AppointmentForm/>
            <AppointmentList clerkId={801}/>
        </React.Fragment>
    );
}

export default App;
