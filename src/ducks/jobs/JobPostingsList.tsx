import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {defaultJobPosting, selectJobPostings, selectOnlyActive} from "./index";
import {filterActiveOnlyAction, fetchJobPostingsAction, jobPostingSelectedAction} from './actions';
import FormCheck from "../../components/FormCheck";
import JobPostingRow from "./JobPostingRow";
import ErrorBoundary from "chums-ducks/dist/components/ErrorBoundary";

const JobPostingsList:React.FC = () => {
    const dispatch = useDispatch();
    const list = useSelector(selectJobPostings);
    const onlyActive = useSelector(selectOnlyActive);

    const setActive = (active:boolean) => dispatch(filterActiveOnlyAction(active))
    const onReload = () => dispatch(fetchJobPostingsAction());
    const onClickNew = () => dispatch(jobPostingSelectedAction(defaultJobPosting))

    useEffect(() => {
        dispatch(fetchJobPostingsAction());
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
                    <button type="button" className="btn btn-primary btn-sm" onClick={onReload}>Reload</button>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClickNew}>New</button>
                </div>
            </div>
            <ErrorBoundary>
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
                    {list.map(posting => <JobPostingRow key={posting.id} posting={posting} /> )}
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
