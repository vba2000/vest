import React from 'react';
import {AppContext, AppState} from "./context";
import {Login, User, Vesting} from "./Pages";
import {Col, Container, Nav, Navbar, Row} from "react-bootstrap";

function App() {

    const appState = AppState();

    return (
        <AppContext.Provider value={appState}>
            <Container fluid={true} className={'m-0 p-0'}>
            <Navbar expand="lg" className="bg-dark-subtle px-4">
                <Nav>
                    <Navbar.Brand href="#">WX Vesting</Navbar.Brand>
                </Nav>
                <Container fluid={true} className={'w-100 m-0 p-0 text-end'}>
                    {appState.user == null ? <Login/> : <User/>}
                </Container>
            </Navbar>
            </Container>
            <Container>
                { appState.user ? <Vesting/> : null }
            </Container>
        </AppContext.Provider>
    );
}

export default App;
