import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand as={Link} to={"/"}>Government of Whatever</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to={"/"} href="#">Book appointment</Nav.Link>
                            <Nav.Link as={Link} to={"/myAppointments"}>Clerk view</Nav.Link>
                            <Nav.Link as={Link} to={"/manageAppointments"}>Manager view</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }

}
