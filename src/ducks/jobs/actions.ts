import {onErrorAction} from 'chums-ducks';
import {
    defaultJobPosting,
    fetchJobsFailed,
    fetchJobsRequested,
    fetchJobsSucceeded,
    fetchJobsURL,
    postJobPostingPDFURL,
    fetchSelectedFailed,
    fetchSelectedRequested,
    fetchSelectedSucceeded,
    JobPosting,
    JobPostingsAction,
    JobPostingThunkAction,
    jobSelected,
    jobUpdated,
    saveJobFailed,
    saveJobPDFFailed,
    saveJobPDFRequested, saveJobPDFSucceeded,
    saveJobRequested,
    saveJobSucceeded,
    selectLoading,
    selectLoadingSelected,
    selectSelectedJobPosting,
    setActiveFilter, deleteJobRequested, deleteJobSucceeded, deleteJobFailed
} from "./index";
import {fetchHandler} from "../../fetchHandler";
import {PropType} from "../../types";

export const jobPostingSelectedAction = (jobPosting:JobPosting = defaultJobPosting):JobPostingsAction => ({type: jobSelected, payload: {jobPosting}})
export const jobPostingUpdatedAction = (props:PropType):JobPostingsAction => ({type: jobUpdated, payload: {props}});
export const filterActiveOnlyAction = (onlyActive:boolean):JobPostingsAction => ({type: setActiveFilter, payload: {onlyActive}});

export const fetchJobPostingsAction = ():JobPostingThunkAction => async (dispatch, getState) => {
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

export const fetchJobPostingAction = ({id}:JobPosting):JobPostingThunkAction =>
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
            console.debug("fetchJobPostingAction()", err.message);
            dispatch({type: fetchSelectedFailed});
            dispatch(onErrorAction(err, fetchSelectedFailed));
        }
}

export const uploadJobPDFAction = (files:FileList):JobPostingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const selected = selectSelectedJobPosting(state);
            if (!selected.id) {
                return dispatch(onErrorAction(new Error('This posting must be saved first')));
            }

            if (!files.length || files.length > 1) {
                return dispatch(onErrorAction(new Error('No file was selected'), saveJobPDFFailed));
            }
            const [file] = files;

            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.upload.addEventListener('progress', ev => {
                dispatch({type: saveJobPDFRequested, payload: {progress: (ev.loaded / ev.total) * 100}});
            });

            xhr.upload.addEventListener('loadstart', (ev) => {
                dispatch({type: saveJobPDFRequested, payload: {progress: (ev.loaded / ev.total) * 100}});
            });

            xhr.upload.addEventListener('abort', (ev) => {
                console.log(ev);
                dispatch({type: saveJobPDFFailed});
            });

            xhr.upload.addEventListener('error', (ev) => {
                console.log(ev);
                dispatch({type: saveJobPDFFailed});
            });

            xhr.upload.addEventListener('timeout', (ev) => {
                console.log(ev);
                dispatch({type: saveJobPDFFailed});
            });

            xhr.upload.addEventListener('load', (ev) => {
                console.log(ev);
                dispatch({type: saveJobPDFSucceeded});
            });

            xhr.onreadystatechange = (ev) => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const {postings, error} = xhr.response;
                    if (postings) {
                        dispatch({type: saveJobPDFSucceeded, payload: {jobPosting: postings[0]}});
                    }
                    if (error) {
                        dispatch(onErrorAction(new Error(error), saveJobPDFFailed));
                    }
                }

            };

            const formData = new FormData();
            formData.append(file.name, file, file.name);
            const url = postJobPostingPDFURL(selected.id);
            xhr.open('POST', url, true);
            xhr.send(formData);
        } catch(err) {
            console.debug("()", err.message);
            dispatch({type: saveJobPDFFailed});
            dispatch(onErrorAction(err, saveJobPDFFailed))
        }
    }

export const saveJobPostingAction = ():JobPostingThunkAction =>
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
            console.debug("saveJobPostingAction()", err.message);
            dispatch({type: saveJobFailed});
            dispatch(onErrorAction(err, saveJobFailed));
        }
}

export const deleteJobPostingAction = ():JobPostingThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectLoading(state) || selectLoadingSelected(state);
            if (loading) {
                return;
            }
            const selected = selectSelectedJobPosting(state);
            if (!selected || !selected.id) {
                return;
            }
            dispatch({type: deleteJobRequested});
            const method = 'delete';
            const url = fetchJobsURL(selected.id);
            const {postings} = await fetchHandler(url, {method})
            dispatch({type: deleteJobSucceeded, payload: {list: postings}});
        } catch(err) {
            console.warn("deleteJobPostingAction()", err.message);
            dispatch({type: deleteJobFailed});
            dispatch(onErrorAction(err, deleteJobRequested));
        }
    }
