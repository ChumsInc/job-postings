import React, {memo} from "react";
import {JobPosting, selectSelectedJobPosting} from "./index";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {fetchJobPostingAction} from "./actions";

interface JobPostingRowProps {
    posting: JobPosting,
}
const JobPostingRow:React.FC<JobPostingRowProps> = ({posting}) => {
    const {id, title, enabled, datePosted, validThrough} = posting;
    const dispatch = useDispatch();
    const selected = useSelector(selectSelectedJobPosting);
    const now = new Date();
    const validDatePosted = !!datePosted && new Date(datePosted) < now && (!validThrough || new Date(validThrough) > now);
    const isFuture = !!datePosted && new Date(datePosted) > now && (!validThrough || new Date(validThrough) > now);
    const className = {
        'text-info': !enabled && (validDatePosted || isFuture),
        'text-success': enabled && validDatePosted,
        'text-warning': !datePosted && !validThrough,
        'text-danger': validThrough && new Date(validThrough) < now,
        'table-active': id === selected.id,
    }
    const iconClassName = {
        'bi-toggle-off': !enabled,
        'bi-toggle-on': enabled
    }

    return (
        <tr className={classNames(className)} onClick={() => dispatch(fetchJobPostingAction(posting))}>
            <td>
                <span className={classNames(iconClassName)} />
            </td>
            <td>{title}</td>
            <td>{datePosted ? new Date(datePosted).toLocaleDateString() : 'N/A'}</td>
            <td>{validThrough ? new Date(validThrough).toLocaleDateString() : 'N/A'}</td>
        </tr>
    )
}
export default memo(JobPostingRow);
