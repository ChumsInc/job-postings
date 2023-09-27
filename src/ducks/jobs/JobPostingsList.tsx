import React, {ChangeEvent, useEffect, useId} from "react";
import {useSelector} from "react-redux";
import {selectJobPostings, selectShowInactive} from "./index";
import {loadJobPosting, loadJobPostings, toggleShowInactive} from './actions';
import JobPostingRow from "./JobPostingRow";
import {ErrorBoundary} from "react-error-boundary";
import {useAppDispatch} from "../../app/configureStore";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";
import {FormCheck} from "chums-components";

const JobPostingsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectJobPostings);
    const showInactive = useSelector(selectShowInactive);
    const id = useId();

    const setActive = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowInactive(ev.target.checked))
    const onReload = () => dispatch(loadJobPostings());
    const onClickNew = () => dispatch(loadJobPosting(0));

    useEffect(() => {
        dispatch(loadJobPostings());
    }, [])

    return (
        <div className="">
            <div className="row g-3">
                <div className="col-auto">
                    <label htmlFor={id}>Show Inactive</label>
                </div>
                <div className="col-auto">
                    <div className="form-check-inline">
                        <FormCheck type="checkbox" checked={showInactive} onChange={setActive} id={id} label="" />
                    </div>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-primary btn-sm" onClick={onReload}>Reload</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClickNew}>New</button>
                </div>
            </div>
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <table className="table table-hover table-sm">
                    <thead>
                    <tr>
                        <th>1/0</th>
                        <th>Title</th>
                        <td>Date Posted</td>
                        <td>End Date</td>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(posting => <JobPostingRow key={posting.id} posting={posting}/>)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colSpan={3}>Postings:</th>
                        <td>{list.length}</td>
                    </tr>
                    </tfoot>
                </table>
            </ErrorBoundary>
        </div>
    )
}
export default JobPostingsList;
