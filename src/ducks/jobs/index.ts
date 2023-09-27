import {RootState} from "../../app/configureStore";
import {JobPosting} from "../../types";
import {createReducer, createSelector} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import {SortProps} from "chums-components";
import {
    loadJobPosting,
    loadJobPostings,
    removeJobPosting,
    saveJobPosting,
    toggleShowInactive,
    updateJobPosting,
    uploadJobPDF
} from "./actions";
import {Editable} from "chums-types";
import {defaultJobPosting} from "./utils";

export type ActionStatus = 'idle' | 'loading' | 'saving' | 'deleting' | 'uploading';

export interface JobsState {
    list: {
        entries: JobPosting[];
        loading: boolean;
        showInactive: boolean;
        sort: SortProps<JobPosting>
    },
    current: {
        entry: JobPosting & Editable;
        status: ActionStatus;
    };
}

export const initialJobsState: JobsState = {
    list: {
        entries: [],
        loading: false,
        showInactive: false,
        sort: {field: 'title', ascending: true}
    },
    current: {
        entry: {...defaultJobPosting},
        status: 'idle',
    }
}

export const defaultSort: SortProps<JobPosting> = {field: "id", ascending: true};

export const listingSorter = (sort: SortProps<JobPosting>) => (a: JobPosting, b: JobPosting) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1
    switch (field) {
        case 'title':
            return (
                a[field].toLowerCase() === b[field].toLowerCase()
                    ? a.id - b.id
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * sortMod;
        default:
            return a.id - b.id;
    }
}

export const selectLoading = (state: RootState) => state.jobs.list.loading;
export const selectList = (state: RootState) => state.jobs.list.entries;
export const selectListSort = (state: RootState) => state.jobs.list.sort;
export const selectCurrentPosting = (state: RootState) => state.jobs.current.entry;
export const selectShowInactive = (state: RootState) => state.jobs.list.showInactive;
export const selectCurrentStatus = (state: RootState) => state.jobs.current.status;

export const selectJobPostings = createSelector(
    [selectList, selectShowInactive, selectListSort],
    (list, showInactive, sort) => {
        const now = new Date();
        // return future postings as well as current postings
        return list.filter((val) => showInactive || (!!val.datePosted && (!val.validThrough || dayjs(val.validThrough).isAfter(now))))
            .sort(listingSorter(sort));
    }
)

const jobsReducer = createReducer(initialJobsState, (builder) => {
    builder
        .addCase(loadJobPostings.pending, (state) => {
            state.list.loading = true;
        })
        .addCase(loadJobPostings.fulfilled, (state, action) => {
            state.list.loading = false;
            state.list.entries = action.payload.sort(listingSorter(defaultSort));
            if (state.current.entry && state.current.entry.id > 0) {
                const [entry] = action.payload.filter(job => job.id === state.current.entry?.id);
                state.current.entry = entry ?? {...defaultJobPosting};
            }
        })
        .addCase(loadJobPostings.rejected, (state, action) => {
            state.list.loading = false;
        })
        .addCase(loadJobPosting.pending, (state, action) => {
            state.current.status = 'loading';
            const [entry] = state.list.entries.filter(e => e.id === action.meta.arg);
            state.current.entry = entry ?? {...defaultJobPosting};
        })
        .addCase(loadJobPosting.fulfilled, (state, action) => {
            state.current.status = 'idle';
            state.current.entry = action.payload ?? {...defaultJobPosting};
            if (action.payload) {
                state.list.entries = [
                    ...state.list.entries.filter(e => e.id !== action.payload?.id),
                    action.payload
                ].sort(listingSorter(defaultSort));
            }
        })
        .addCase(loadJobPosting.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(uploadJobPDF.pending, (state) => {
            state.current.status = 'uploading';
        })
        .addCase(uploadJobPDF.fulfilled, (state, action) => {
            state.current.status = 'idle';
        })
        .addCase(uploadJobPDF.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(saveJobPosting.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(saveJobPosting.fulfilled, (state, action) => {
            state.current.entry = action.payload ?? {...defaultJobPosting};
            state.current.status = 'idle';
            if (action.payload) {
                state.list.entries = [
                    ...state.list.entries.filter(e => e.id !== action.payload?.id),
                    action.payload
                ].sort(listingSorter(defaultSort));
            }
        })
        .addCase(saveJobPosting.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(removeJobPosting.pending, (state) => {
            state.current.status = 'deleting';
        })
        .addCase(removeJobPosting.fulfilled, (state, action) => {
            state.list.entries = action.payload.sort(listingSorter(defaultSort));
            state.current.entry = {...defaultJobPosting};
            state.current.status = 'idle';
        })
        .addCase(removeJobPosting.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(toggleShowInactive, (state, action) => {
            state.list.showInactive = action.payload ?? !state.list.showInactive;
        })
        .addCase(updateJobPosting, (state, action) => {
            if (state.current.entry) {
                state.current.entry = {...state.current.entry, ...action.payload, changed: true};
            }
        })

});

export default jobsReducer;
