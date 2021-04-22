import React, {memo} from "react";
import {JobPosting, selectSelectedJobPosting} from "./index";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {fetchJobPosting, jobPostingSelectedAction} from "./actions";

interface JobPostingRowProps {
    posting: JobPosting,
}
const JobPostingRow:React.FC<JobPostingRowProps> = ({posting}) => {
    const {id, title, datePosted, validThrough} = posting;
    const dispatch = useDispatch();
    const selected = useSelector(selectSelectedJobPosting);
    const now = new Date();
    const className = {
        'table-success': datePosted && new Date(datePosted) < now && (!validThrough || new Date(validThrough) > now),
        'table-info': datePosted && new Date(datePosted) > now && (!validThrough || new Date(validThrough) > now),
        'table-active': id === selected.id,
        'text-danger': validThrough && new Date(validThrough) < now,
    }

    return (
        <tr className={classNames(className)} onClick={() => dispatch(fetchJobPosting(posting))}>
            <td>{title}</td>
            <td>{datePosted ? new Date(datePosted).toLocaleDateString() : 'N/A'}</td>
        </tr>
    )
}
export default memo(JobPostingRow);
