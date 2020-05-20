import React from "react";
import {Accordion, Card, Col, Row, Table} from "react-bootstrap";

function AppointmentView(props) {
    return (
        <Accordion className={'my-1'}>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={props.appointment.date}>
                    <Row>
                        <Col>
                            {props.appointment.name} - {new Date(props.appointment.date).toTimeString().substring(0, 5)}
                        </Col>
                        <Col className={"text-right"}>
                            <em>Click to see issues</em>
                        </Col>
                    </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={props.appointment.date}>
                    <Card.Body>
                        <Table>
                            <thead>
                            <tr>
                                <th>Issue</th>
                                <th>Estimated time</th>
                                <th>Required documents</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                props.issues.map((issue) => {
                                    return (
                                        <tr>
                                            <td>{issue.issue}</td>
                                            <td>{issue.est} Minutes</td>
                                            <td>{issue.documents.join(', ')}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td/>
                                <td>Total estimated time:</td>
                                <td>
                                    {
                                        props.issues.reduce(
                                            (total, iss) => {
                                                return total + iss.est;
                                            }, 0)
                                    } minutes
                                </td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AppointmentView;