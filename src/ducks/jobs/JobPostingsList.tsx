import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectJobPostings} from "./index";
import {loadJobPostings} from './actions';
import JobPostingRow from "./JobPostingRow";
import {ErrorBoundary} from "react-error-boundary";
import {useAppDispatch} from "../../app/configureStore";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";
import JobPostingsFilter from "./JobPostingsFilter";
import {TablePagination} from "@chumsinc/sortable-tables";

const JobPostingsList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectJobPostings);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);


    useEffect(() => {
        dispatch(loadJobPostings());
    }, []);

    const rppChangeHandler = (rpp: number) => {
        setPage(0);
        setPage(rpp);
    }

    return (
        <div className="">
            <JobPostingsFilter/>
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
                    {list
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(posting => <JobPostingRow key={posting.id} posting={posting}/>)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colSpan={3}>Postings:</th>
                        <td>{list.length}</td>
                    </tr>
                    </tfoot>
                </table>
                <TablePagination page={page} onChangePage={setPage} size="sm"
                                 rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rppChangeHandler}}
                                 count={list.length} showFirst showLast
                />
            </ErrorBoundary>
        </div>
    )
}
export default JobPostingsList;
