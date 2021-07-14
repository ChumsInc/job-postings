import {Action, combineReducers} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {PropType} from "../../types";
import {AlertAction} from "chums-ducks";
import {createSelector} from "@reduxjs/toolkit";

export const fetchJobsRequested = 'app/jobs/fetch-requested';
export const fetchJobsSucceeded = 'app/jobs/fetch-succeeded';
export const fetchJobsFailed = 'app/jobs/fetch-failed';
export const fetchSelectedRequested = 'app/jobs/fetch-selected-requested';
export const fetchSelectedSucceeded = 'app/jobs/fetch-selected-succeeded';
export const fetchSelectedFailed = 'app/jobs/fetch-selected-failed';

export const jobSelected = 'app/jobs/selected';
export const jobUpdated = 'app/jobs/updated';

export const saveJobRequested = 'app/jobs/save-requested';
export const saveJobSucceeded = 'app/jobs/save-succeeded';
export const saveJobFailed = 'app/jobs/save-failed';

export const deleteJobRequested = 'app/jobs/delete-requested';
export const deleteJobSucceeded = 'app/jobs/delete-succeeded';
export const deleteJobFailed = 'app/jobs/delete-failed';

export const saveJobPDFRequested = 'app/jobs/save-pdf-requested';
export const saveJobPDFSucceeded = 'app/jobs/save-pdf-succeeded';
export const saveJobPDFFailed = 'app/jobs/save-pdf-failed';

export const setActiveFilter = 'app/jobs/filter-active';


export const fetchJobsURL = (id?: number) => `/api/timeclock-admin/job-postings/${encodeURIComponent(String(id || ''))}`;
export const postJobPostingPDFURL = (id: number) => fetchJobsURL(id) + '/upload-pdf';

export declare type ValidEmploymentType =
    'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACTOR'
    | 'TEMPORARY'
    | 'INTERN'
    | 'VOLUNTEER'
    | 'PER_DIEM'
    | 'OTHER';

export type EmploymentTypeMap = { [employmentType in ValidEmploymentType]: string }

export const EmploymentTypes: EmploymentTypeMap = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACTOR: 'Contractor',
    TEMPORARY: 'Temporary',
    INTERN: 'Intern',
    VOLUNTEER: 'Volunteer',
    PER_DIEM: 'Per Diem',
    OTHER: 'Other',
}

export interface BaseSalary {
    value?: number,
    minValue?: number,
    maxValue?: number,
    unitText: string,
}

export interface JobPosting {
    id: number,
    title: string,
    enabled: boolean,
    description: string,
    datePosted: string | null,
    jobLocation: string,
    validThrough: string | null,
    baseSalary?: BaseSalary | null,
    employmentType: ValidEmploymentType,
    educationalRequirements: string,
    experienceRequirements: number
    experienceInPlaceOfEducation: boolean,
    filename: string,
    emailRecipient?: string,
    applicationInstructions?: string,
    timestamp: string,
    changed?: boolean,
}

export interface JobPostingsAction extends Action {
    payload?: {
        list?: JobPosting[],
        jobPosting?: JobPosting,
        props?: PropType,
        onlyActive?: boolean,
        progress?: number,
    }
}

export interface JobPostingThunkAction extends ThunkAction<void, RootState, unknown, JobPostingsAction | AlertAction> {
}

interface JobState {
    list: JobPosting[],
    selected: JobPosting,
    loading: boolean,
    loadingSelected: boolean,
    onlyActive: boolean,
}

export const defaultJobPosting: JobPosting = {
    id: 0,
    title: '',
    enabled: false,
    description: '',
    datePosted: null,
    jobLocation: '',
    validThrough: null,
    baseSalary: null,
    employmentType: 'FULL_TIME',
    educationalRequirements: '',
    experienceRequirements: 0,
    experienceInPlaceOfEducation: true,
    emailRecipient: '',
    filename: '',
    applicationInstructions: '',
    timestamp: '',
}

const initialJobState: JobState = {
    list: [],
    selected: defaultJobPosting,
    loading: false,
    loadingSelected: false,
    onlyActive: false,
}

export const selectLoading = (state: RootState) => state.jobs.loading;
export const selectLoadingSelected = (state: RootState) => state.jobs.loadingSelected;
export const selectSelectedJobPosting = (state: RootState) => state.jobs.selected;
export const selectOnlyActive = (state: RootState) => state.jobs.onlyActive;

/**
 * @desc Returns all postings (if onlyActive === false) or future postings as well as current postings (if onlyActive === true)
 */
export const selectJobPostings = createSelector(
    [
        (state: RootState) => state.jobs.list,
        (state: RootState) => state.jobs.onlyActive,
    ],
    (list, onlyActive) => {
        const now = new Date();
        // return future postings as well as current postings
        return list.filter(({
                                datePosted,
                                validThrough
                            }) => !onlyActive || (!!datePosted && (!validThrough || new Date(validThrough) > now)));
    }
)

const jobDefaultSort = (a: JobPosting, b: JobPosting) => a.id - b.id;

const listReducer = (state: JobPosting[] = initialJobState.list, action: JobPostingsAction) => {
    const {type, payload} = action;
    switch (type) {
    case fetchJobsSucceeded:
    case deleteJobSucceeded:
        return payload?.list || [];
    case saveJobSucceeded: {
        const posting = payload?.jobPosting;
        if (!posting) {
            return state;
        }
        return [
            ...state.filter(j => j.id !== posting.id),
            posting,
        ].sort(jobDefaultSort)
    }
    default:
        return state;
    }
}

const selectedReducer = (state: JobPosting = initialJobState.selected, action: JobPostingsAction) => {
    const {type, payload} = action;
    switch (type) {
    case jobSelected:
    case fetchSelectedSucceeded:
    case saveJobSucceeded:
    case saveJobPDFSucceeded:
        return {...payload?.jobPosting || defaultJobPosting};
    case jobUpdated:
        return {
            ...state,
            ...payload?.props,
            changed: true,
        }
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = initialJobState.loading, action: JobPostingsAction) => {
    switch (action.type) {
    case fetchJobsRequested:
        return true;
    case fetchJobsSucceeded:
    case fetchJobsFailed:
        return false;
    default:
        return state;
    }
}

const loadingSelectedReducer = (state: boolean = initialJobState.loading, action: JobPostingsAction) => {
    switch (action.type) {
    case fetchJobsRequested:
    case saveJobRequested:
    case saveJobPDFRequested:
        return true;
    case fetchJobsSucceeded:
    case fetchJobsFailed:
    case saveJobSucceeded:
    case saveJobFailed:
    case saveJobPDFSucceeded:
    case saveJobPDFFailed:
        return false;
    default:
        return state;
    }
}

const onlyActiveReducer = (state: boolean = initialJobState.onlyActive, action: JobPostingsAction) => {
    const {type, payload} = action;
    switch (type) {
    case setActiveFilter:
        return payload?.onlyActive || false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    loadingSelected: loadingSelectedReducer,
    onlyActive: onlyActiveReducer,
})
