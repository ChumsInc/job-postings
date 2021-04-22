import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {defaultJobPosting, selectJobPostings, selectOnlyActive, selectSelectedJobPosting,} from "./index";
import {filterActiveOnlyAction, fetchJobPosting, fetchJobPostings} from './actions';
import FormCheck from "../../components/FormCheck";
import JobPostingRow from "./JobPostingRow";

const JobPostingsList:React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(selectJobPostings);
    const onlyActive = useSelector(selectOnlyActive);

    const setActive = (active:boolean) => dispatch(filterActiveOnlyAction(active))
    const onNewPosting = () => dispatch(fetchJobPosting(defaultJobPosting));
    useEffect(() => {
        dispatch(fetchJobPostings());
    }, [])

    return (
        <div className="">
            <div className="row g-3">
                <div className="col-auto">
                    <label>Show</label>
                </div>
                <div className="col-auto">
                    <div className="form-check-inline">
                        <FormCheck type="radio" checked={onlyActive} inline onChange={() => setActive(true)}>Active</FormCheck>
                        <FormCheck type="radio" checked={!onlyActive} inline onChange={() => setActive(false)}>All</FormCheck>
                    </div>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-primary btn-sm" onClick={onNewPosting}>New Posting</button>
                </div>
            </div>
            <table className="table table-hover table-sm">
                <thead>
                <tr>
                    <th>Title</th>
                    <td>Posted</td>
                </tr>
                </thead>
                <tbody>
                {list.map(posting => <JobPostingRow key={posting.id} posting={posting} /> )}
                </tbody>
                <tfoot>
                <tr>
                    <th>Postings:</th>
                    <td>{list.length}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    )
}
export default JobPostingsList;
