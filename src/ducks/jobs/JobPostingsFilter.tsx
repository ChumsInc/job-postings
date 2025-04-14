import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormCheck from "react-bootstrap/FormCheck";
import {selectShowInactive} from "./index";
import {loadJobPostings, toggleShowInactive} from "./actions";
import Button from 'react-bootstrap/Button'

export default function JobPostingsFilter() {
    const dispatch = useAppDispatch();
    const showInactive = useAppSelector(selectShowInactive);

    const onClickShowInactive = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowInactive(ev.target.checked));
    }
    const reloadHandler = () => {
        dispatch(loadJobPostings());
    }

    const id = useId();

    return (
        <Row>
            <Col xs="auto">
                <FormCheck id={id} label="Show Inactive"
                           checked={showInactive} onChange={onClickShowInactive}/>
            </Col>
            <Col></Col>
            <Col xs="auto">
                <Button variant="primary" size="sm"
                        onClick={reloadHandler}>
                    Reload
                </Button>
            </Col>
        </Row>
    )
}
