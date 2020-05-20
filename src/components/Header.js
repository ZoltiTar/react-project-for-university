import React from "react";
import {Nav, Navbar} from "react-bootstrap";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand href="#">Government of Whatever</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#">Book appointment</Nav.Link>
                            <Nav.Link href="#">Clerk view</Nav.Link>
                            <Nav.Link href="#">Manager view</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        )
    }

}
