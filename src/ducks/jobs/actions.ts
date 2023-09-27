import {selectCurrentStatus, selectLoading} from "./index";
import {JobPosting} from "../../types";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {deleteJobPosting, fetchJobPosting, fetchJobPostings, postJobPDF, PostJobPDFArgs, postJobPosting} from "./api";


export const updateJobPosting = createAction<Partial<JobPosting>>('jobs/current/update');
export const toggleShowInactive = createAction<boolean | undefined>('jobs/list/toggleShowInactive');

export const loadJobPostings = createAsyncThunk<JobPosting[]>(
    'jobs/list/load',
    async () => {
        return await fetchJobPostings();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    }
)

export const loadJobPosting = createAsyncThunk<JobPosting | null, number>(
    'jobs/current/load',
    async (arg) => {
        return await fetchJobPosting(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentStatus(state) === 'idle';
        }
    }
)

export const uploadJobPDF = createAsyncThunk<boolean, PostJobPDFArgs>(
    'jobs/current/postPDF',
    async (arg) => {
        return await postJobPDF(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.id && !!arg.files.length && selectCurrentStatus(state) === 'idle';
        }
    }
)


export const saveJobPosting = createAsyncThunk<JobPosting | null, JobPosting>(
    'jobs/current/save',
    async (arg) => {
        return await postJobPosting(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentStatus(state) === 'idle';
        }
    }
)

export const removeJobPosting = createAsyncThunk<JobPosting[], number>(
    'jobs/current/remove',
    async (arg) => {
        return await deleteJobPosting(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentStatus(state) === 'idle';
        }
    }
)
