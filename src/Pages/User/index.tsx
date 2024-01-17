import React, {useContext} from "react";
import {AppContext} from "../../context";
import {Badge, Button, Container} from "react-bootstrap";


export const User = ({ ...props }) => {
    const { user, userName, logout } = useContext(AppContext);

    return <Container className={'p-0 m-0'}><Badge bg="secondary">{userName}</Badge><Button className={'m-0'} variant="link" onClick={logout}>{user}</Button></Container>
};