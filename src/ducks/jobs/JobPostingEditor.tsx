import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectCurrentPosting} from "./index";
import {loadJobPosting, removeJobPosting, saveJobPosting, updateJobPosting,} from "./actions";
import classNames from "classnames";
import {Badge, FormCheck, FormColumn, Input} from "chums-components";
import Select from "../../components/Select";
import DateInput from "../../components/DateInput";
import {ErrorBoundary} from "react-error-boundary";
import GUIEditor2 from "../../components/GUIEditor2";
import JobPostingPDFSelector from "./JobPostingPDFSelector";
import TextArea from "../../components/TextArea";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";
import {useAppDispatch} from "../../app/configureStore";
import {JobPosting, ValidEmploymentType} from "../../types";
import dayjs from "dayjs";
import {EmploymentTypes} from "./utils";

interface JobPostingIconProps {
    id: number,
    changed?: boolean,
    datePosted: string | null,
    validThrough: string | null,
}

const JobPostingIcon = ({id, changed, datePosted, validThrough}: JobPostingIconProps) => {
    const now = new Date();
    const className = {
        'bi-person-plus': !id,
        'bi-person-plus-fill': !!id,
        'text-dark': changed,
        'text-success': datePosted && new Date(datePosted) < now && (!validThrough || new Date(validThrough) > now),
        'text-info': datePosted && new Date(datePosted) > now && (!validThrough || new Date(validThrough) > now),
    }
    return (
        <Badge color={changed ? 'warning' : 'light'} className="ms-3"><span className={classNames(className)}/></Badge>
    )
}
const JobPostingEditor = () => {
    const dispatch = useAppDispatch();
    const posting = useSelector(selectCurrentPosting);

    const changeHandler = (field: keyof JobPosting) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'datePosted':
                return dispatch(updateJobPosting({
                    [field]: dayjs(ev.target.valueAsDate).isValid()
                        ? dayjs(ev.target.valueAsDate).startOf('day').toISOString()
                        : null
                }))
            case 'validThrough':
                return dispatch(updateJobPosting({
                    [field]: dayjs(ev.target.valueAsDate).isValid()
                        ? dayjs(ev.target.valueAsDate).endOf('day').toISOString()
                        : null
                }));
            case 'enabled':
            case 'experienceInPlaceOfEducation':
                return dispatch(updateJobPosting({[field]: ev.target.checked}));
            case 'experienceRequirements':
                return dispatch(updateJobPosting({[field]: ev.target.valueAsNumber}));
            case 'filename':
            case 'id':
            case 'timestamp':
            case 'changed':
            case 'description':
                return;
            default:
                return dispatch(updateJobPosting({[field]: ev.target.value}));
        }
    }

    const selectChangeHandler = (field: keyof JobPosting) => (ev: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'jobLocation':
                return dispatch(updateJobPosting({[field]: ev.target.value}));
        }
    }

    const guiChangeHandler = (value: string) => {
        return dispatch(updateJobPosting({description: value}));
    }

    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        dispatch(saveJobPosting(posting))
    }

    const onNewPosting = () => dispatch(loadJobPosting(0));

    const onDeletePosting = () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) {
            return;
        }
        dispatch(removeJobPosting(posting.id));
    }


    const clearFilename = () => {
        return dispatch(updateJobPosting({filename: ''}));
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <form onSubmit={onSubmit}>
                <div className="row g-3 sticky-top align-items-center mb-3 bg-light">
                    <h3 className="col">
                        {posting.title || 'Position Title'}
                        <JobPostingIcon id={posting.id} changed={posting.changed}
                                        datePosted={posting.datePosted}
                                        validThrough={posting.validThrough}/>
                    </h3>
                    <div className="col-auto">
                        <FormCheck label="Enabled" checked={posting.enabled} type="checkbox"
                                   onChange={changeHandler('enabled')}/>
                    </div>
                </div>
                <div>
                    <FormColumn label="Title">
                        <Input value={posting.title} onChange={changeHandler('title')}
                               required
                               placeholder="Job Posting Title"/>
                    </FormColumn>
                    <FormColumn label="Date Posted">
                        <DateInput value={posting.datePosted || ''} required
                                   onChange={changeHandler('datePosted')}
                                   placeholder="Date Posted"/>
                        <small className="text-muted">
                            You can set a future date to schedule a job posting. Posting a date in the future is a good
                            way to preview the posting before making it live.
                        </small>
                    </FormColumn>
                    <FormColumn label="Valid Through">
                        <DateInput value={posting.validThrough || ''}
                                   onChange={changeHandler('validThrough')}
                                   min={posting.datePosted || ''}
                                   placeholder="Valid Through"/>
                        <small className="text-muted">
                            You can turn off a posting be setting it's '<strong>valid through</strong>' date to a date
                            in the past. Once the '<strong>valid through</strong>' date is passed, the posting will
                            no longer be shown on the websites.
                        </small>
                    </FormColumn>
                    <FormColumn label="Job Description PDF">
                        {!!posting.filename && (
                            <div className="row g-3">
                                <div className="col">
                                    <a href={`https://intranet.chums.com/pdf/jobs/${posting.filename}`}
                                       target="_blank">Download</a>
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-sm btn-outline-secondary"
                                            onClick={clearFilename}>
                                        Upload new file
                                    </button>
                                </div>
                            </div>

                        )}
                        {!posting.filename && <JobPostingPDFSelector/>}
                    </FormColumn>
                    <FormColumn label="Job Description">
                        <GUIEditor2 value={posting.description} onChange={guiChangeHandler}
                                    onChangeTimer={30000}/>
                        <small className="text-muted">
                            When pasting from Word, you must replace the bullet dots with the list dots in the above
                            toolbar.
                            When copying from PDF, you must also remove any unwanted line breaks.
                        </small>
                    </FormColumn>
                    <FormColumn label="Job Location">
                        <Select value={posting.jobLocation}
                                onChange={selectChangeHandler('jobLocation')}
                                className="form-select form-select-sm">
                            <option value="">Select a Location</option>
                            <option value="slc">Salt Lake City, UT</option>
                            <option value="ketchum">Ketchum, ID</option>
                            <option value="hurricane">Hurricane, UT</option>
                            <option value="telecommute">Telecommute</option>
                        </Select>
                        {posting.jobLocation === 'telecommute' && (
                            <small className="text-muted">
                                Jobs marked as TELECOMMUTE must be fully remote. Don't mark up jobs that allow
                                occasional work-from-home, jobs for which remote work is a negotiable benefit, or
                                have other arrangements that are not 100% remote. The "gig economy" nature of a job
                                doesn't imply that it is or is not remote.
                                <strong>The job description must clearly state that the job is 100% remote.</strong>
                            </small>
                        )}
                    </FormColumn>
                    <FormColumn label="Employment Type">
                        <Select value={posting.employmentType || ''}
                                onChange={selectChangeHandler('employmentType')}
                                className="form-select form-select-sm">
                            <option value="">Select One</option>
                            {Object.keys(EmploymentTypes).map((key) => (
                                <option key={key} value={key}>{EmploymentTypes[key as ValidEmploymentType]}</option>
                            ))}
                        </Select>
                    </FormColumn>
                    <FormColumn label="Education Requirements">
                        <Input id="jp--education-requirements" value={posting.educationalRequirements}
                               onChange={changeHandler('educationalRequirements')}
                               list="jp--education-requirements-list" maxLength={90}/>
                        <datalist id="jp--education-requirements-list">
                            <option>no requirements</option>
                            <option>high school</option>
                            <option>associate degree</option>
                            <option>bachelor degree</option>
                            <option>professional certificate</option>
                            <option>postgraduate degree</option>
                        </datalist>
                        <small className="text-muted">
                            These are the preferred values for Google; will appear friendlier on the page.
                        </small>
                    </FormColumn>
                    <FormColumn label="Experience Requirements">
                        <div className="row g-3">
                            <div className="col-auto">
                                <div className="input-group input-group-sm">
                                    <Input type="number" min="0" value={posting.experienceRequirements ?? '0'}
                                           onChange={changeHandler('experienceRequirements')}/>
                                    <span className="input-group-text">Months</span>
                                </div>
                            </div>
                            <div className="col-auto">
                                <FormCheck label="Allow Experience in place of Education"
                                           checked={posting.experienceInPlaceOfEducation} inline
                                           type="checkbox"
                                           onChange={changeHandler('experienceInPlaceOfEducation')}/>
                            </div>
                        </div>
                    </FormColumn>
                    <FormColumn label="Application Instructions">
                        <TextArea value={posting.applicationInstructions || ''}
                                  onChange={changeHandler('applicationInstructions')}/>
                    </FormColumn>
                    <FormColumn label="Email Recipient">
                        <div className="row g-3">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">@</span>
                                <Input type="email" value={posting.emailRecipient || ''}
                                       placeholder="jobs@chums.com"
                                       onChange={changeHandler('emailRecipient')}/>
                            </div>
                            <small>Defaults to jobs@chums.com; enter a different address to override.</small>
                        </div>
                    </FormColumn>

                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-3">Save</button>
                    <button type="button" className="btn btn-outline-secondary me-3" onClick={onNewPosting}>
                        New Posting
                    </button>
                    <button type="button" className="btn btn-outline-danger me-3" onClick={onDeletePosting}
                            disabled={posting.id === 0}>
                        Delete Posting
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    )
}

export default JobPostingEditor;
