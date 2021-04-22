import {onErrorAction} from 'chums-ducks';
import {
    defaultJobPosting,
    fetchJobsFailed,
    fetchJobsRequested, fetchJobsSucceeded,
    fetchJobsURL, fetchSelectedFailed, fetchSelectedRequested, fetchSelectedSucceeded, JobPosting, JobPostingsAction,
    JobPostingThunkAction, jobSelected, jobUpdated, saveJobFailed, saveJobRequested, saveJobSucceeded,
    selectLoading,
    selectLoadingSelected, selectSelectedJobPosting, setActiveFilter
} from "./index";
import {fetchHandler} from "../../fetchHandler";
import {PropType} from "../../types";

export const jobPostingSelectedAction = (jobPosting:JobPosting = defaultJobPosting):JobPostingsAction => ({type: jobSelected, payload: {jobPosting}})
export const jobPostingUpdatedAction = (props:PropType):JobPostingsAction => ({type: jobUpdated, payload: {props}});
export const filterActiveOnlyAction = (onlyActive:boolean):JobPostingsAction => ({type: setActiveFilter, payload: {onlyActive}});

export const fetchJobPostings = ():JobPostingThunkAction => async (dispatch, getState) => {
    try {
        const state = getState();
        const loading = selectLoading(state) || selectLoadingSelected(state);
        if (loading) {
            return;
        }
        dispatch({type: fetchJobsRequested});
        const url = fetchJobsURL();
        const {postings} = await fetchHandler(url, {cache: "no-cache"});
        dispatch({type: fetchJobsSucceeded, payload: {list: postings}});
    } catch(err) {
        console.debug("()", err.message);
        dispatch({type: fetchJobsFailed});
        dispatch(onErrorAction(err, fetchJobsFailed));
    }
}

export const fetchJobPosting = ({id}:JobPosting):JobPostingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectLoading(state) || selectLoadingSelected(state);
            if (loading) {
                return;
            }
            if (id === 0) {
                return ({type: jobSelected, payload: {posting: defaultJobPosting}})
            }
            dispatch({type: fetchSelectedRequested});
            const url = fetchJobsURL(id);
            const {postings} = await fetchHandler(url, {cache: "no-cache"});
            const [jobPosting = defaultJobPosting] = postings;
            dispatch({type: fetchSelectedSucceeded, payload: {jobPosting}});

        } catch(err) {
            console.debug("fetchJobPosting()", err.message);
            dispatch({type: fetchSelectedFailed});
            dispatch(onErrorAction(err, fetchSelectedFailed));
        }
}

export const saveJobPosting = ():JobPostingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectLoading(state) || selectLoadingSelected(state);
            const selected = selectSelectedJobPosting(state);
            if (loading) {
                return;
            }
            dispatch({type: saveJobRequested});
            const method = selected.id === 0 ? 'post' : 'put';
            const url = fetchJobsURL(selected.id);
            const {postings} = await fetchHandler(url, {method, body: JSON.stringify(selected)})
            const [jobPosting = defaultJobPosting] = postings;
            dispatch({type: saveJobSucceeded, payload: {jobPosting}});
        } catch(err) {
            console.debug("saveJobPosting()", err.message);
            dispatch({type: saveJobFailed});
            dispatch(onErrorAction(err, saveJobFailed));
        }
}

