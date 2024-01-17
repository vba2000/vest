import {useContext} from "react";
import {AppContext} from "../../context";
import {Button, Container} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


export const Login = ({ ...props }) => {

    const { login } = useContext(AppContext);

    return <Container className={'m-0 p-0'}>
        <Button  onClick={login}>Login</Button>
    </Container>;
};