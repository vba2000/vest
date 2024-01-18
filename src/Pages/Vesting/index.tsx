import React, {useCallback, useContext, useEffect, useState} from "react";
import {AppContext} from "../../context";
import {Col, Row, Container, Button, Card, Spinner} from "react-bootstrap";
import {evaluate} from "../../Utils";


export type TVestingState = {
    toClaim: number;
    reamainAmount: number;
    claimed: number;
    locked: number;
    unlocked: number;
    vestings: Array<{
        reamainAmount: number;
        locked: number;
        unlocked: number;
        height: number;
    }>;
};

const defaultState = {
    toClaim: 0,
    reamainAmount: 0,
    claimed: 0,
    locked: 0,
    unlocked: 0,
    vestings: []
} as TVestingState;

export const Vesting = ({ ...props }) => {
    const { user, nodeUrl, vestingContract, isLogin, claimWX} = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<TVestingState>(defaultState);

    const updateState = useCallback(async () => {
        if (!isLogin) {
            return;
        }
        setIsLoading(true);
        try {
            let {result} = await evaluate(nodeUrl, vestingContract, {expr: `userInfoREADONLY("${user}")`});
            const toClaim = result.value['_2'].value['_1'].value || 0;
            const {
                reamainAmount,
                claimed,
                locked,
                unlocked,
                vestings
            } = result.value['_2'].value['_3'].value.reduce((acc: any, {value = []}: any) => {
                const [totalAmount, height, unlocked, locked] = value;
                const vesting = {
                    totalReaminAmount: Number(totalAmount.value) || 0,
                    locked: Number(locked.value) || 0,
                    unlocked: Number(unlocked.value) || 0,
                    height: Number(height.value) || 0,
                };

                acc.vestings.push(vesting);
                acc.reamainAmount = vesting.totalReaminAmount;
                acc.locked += vesting.locked;
                acc.unlocked += vesting.unlocked;
                return acc;
            }, {reamainAmount: 0, claimed: 0, locked: 0, unlocked: 0, vestings: []});

            setState({
                toClaim,
                reamainAmount,
                claimed,
                locked,
                unlocked,
                vestings
            });
        } catch (e) {

        }
        setIsLoading(false);

    }, [isLogin]);

    useEffect(() => {
        updateState();
    }, []);

    const onClaim = useCallback(async () => {
        setIsLoading(true);
        try {
            await claimWX();
            await new Promise((res) => setTimeout(res, 10000));
            await updateState();
        } catch (e) {

        }
    }, []);


    if (isLoading) {
        return <Container className={'text-center mt-5'}>
            <Row>
                <Col><Spinner/></Col>
            </Row>
        </Container>
    }

    if (!state.toClaim && !state.claimed && !state.locked ) {
        return <Container className={'text-center mt-5'}>
            <Row>
                <Col><h2>No Data</h2></Col>
            </Row>
        </Container>
    }

    return <Container className={' mt-5'}>
        <Row>
            <Col>
                Update data
            </Col>
            <Col md={2}>
                <Button size={'sm'} variant={'outline-info'} onClick={updateState}>Go</Button>
            </Col>
        </Row>
        <Row className={'my-2'}>
            <hr/>
        </Row>
        <Row>
            <Col>Remain amount</Col>
            <Col md={2}>{state.reamainAmount / 10 ** 8} WX</Col>
        </Row>
        <Row className={'my-2'}>
            <hr/>
        </Row>
        <Row>
            <Col>To claim</Col>
            <Col md={2}>{state.toClaim / 10 ** 8} WX</Col>
        </Row>
        <Row className={'my-2'}>
            <hr/>
        </Row>
        <Row>
            <Col>Claim unlocked</Col>
            <Col md={2}><Button size={'sm'} disabled={!state.toClaim} onClick={onClaim}>Claim</Button></Col>
        </Row>
    </Container>;
};