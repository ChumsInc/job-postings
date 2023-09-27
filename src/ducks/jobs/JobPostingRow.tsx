import React, {memo, useEffect, useState} from "react";
import {selectCurrentPosting} from "./index";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {loadJobPosting} from "./actions";
import {JobPosting} from "../../types";
import {useAppDispatch} from "../../app/configureStore";
import dayjs from "dayjs";

interface JobPostingRowProps {
    posting: JobPosting;
}

const isValidDatePosted = (posting:JobPosting):boolean => {
    if (!posting || !posting.datePosted) {
        return false;
    }
    const now = new Date();
    const posted = dayjs(posting.datePosted);
    const validThrough = dayjs(posting.validThrough);
    return posted.isValid() && posted.startOf('day').isBefore(now)
        && (!posting.validThrough || (validThrough.isValid() && validThrough.endOf('day').isAfter(now)));
}

const isFuture = (posting:JobPosting):boolean => {
    if (!posting|| !posting.datePosted) {
        return false;
    }
    const datePosted = dayjs(posting.datePosted);
    return datePosted.isValid() && datePosted.endOf('day').isAfter(new Date());
}

const JobPostingRow = ({posting}: JobPostingRowProps) => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentPosting);
    const [current, setCurrent] = useState<boolean>(isValidDatePosted(posting));
    const [future, setFuture] = useState<boolean>(isFuture(posting));

    useEffect(() => {
        setCurrent(isValidDatePosted(posting));
        setFuture(isFuture(posting));
    }, [posting]);

    const className = {
        'table-info': posting.enabled && future,
        'table-success': posting.enabled && current,
        'table-warning': posting.enabled && !posting.datePosted && !posting.validThrough,
        'table-danger': posting.enabled && !current,
        'table-secondary': !posting.enabled,
        'table-active': posting.id === selected.id,
    }
    const iconClassName = {
        'bi-toggle-off': !posting.enabled,
        'bi-toggle-on': posting.enabled
    }

    const posted = dayjs(posting.datePosted);
    const validThrough = dayjs(posting.validThrough);
    return (
        <tr className={classNames(className)} onClick={() => dispatch(loadJobPosting(posting.id))}>
            <td>
                <span className={classNames(iconClassName)}/>
            </td>
            <td>{posting.title}</td>
            <td>{posted.isValid() ? posted.toDate().toLocaleDateString() : 'N/A'}</td>
            <td>{validThrough.isValid() ? validThrough.toDate().toLocaleDateString() : 'N/A'}</td>
        </tr>
    )
}
export default JobPostingRow;
