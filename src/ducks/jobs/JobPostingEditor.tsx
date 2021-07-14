import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {defaultJobPosting, EmploymentTypes, selectSelectedJobPosting, ValidEmploymentType} from "./index";
import {
    deleteJobPostingAction,
    jobPostingSelectedAction,
    jobPostingUpdatedAction,
    saveJobPostingAction,
} from "./actions";
import Input from "../../components/Input";
import FormRow from "../../components/FormRow";
import FormCheck from "../../components/FormCheck";
import classNames from "classnames";
import {Badge} from "chums-ducks";
import Select from "../../components/Select";
import DateInput from "../../components/DateInput";
import ErrorBoundary from "chums-ducks/dist/components/ErrorBoundary";
import GUIEditor from "../../components/GUIEditor";
import JobPostingPDFSelector from "./JobPostingPDFSelector";
import TextArea from "../../components/TextArea";

interface JobPostingIconProps {
    id: number,
    changed?: boolean,
    datePosted: string | null,
    validThrough: string | null,
}

const JobPostingIcon: React.FC<JobPostingIconProps> = ({id, changed, datePosted, validThrough}) => {
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
const JobPostingEditor: React.FC = () => {
    const dispatch = useDispatch();
    const {
        id,
        title,
        enabled,
        description,
        datePosted,
        jobLocation,
        validThrough,
        // baseSalary,
        employmentType,
        educationalRequirements,
        experienceRequirements,
        experienceInPlaceOfEducation,
        emailRecipient,
        filename,
        applicationInstructions,
        changed,
        timestamp
    } = useSelector(selectSelectedJobPosting);


    useEffect(() => {

    }, [id, timestamp]);

    const onChange = (field: string, value: string | number | boolean) => {
        dispatch(jobPostingUpdatedAction({[field]: value}))
    }

    const onSubmit = (ev: React.FormEvent) => {
        ev.preventDefault();
        dispatch(saveJobPostingAction())
    }

    const onNewPosting = () => dispatch(jobPostingSelectedAction(defaultJobPosting));

    const onDeletePosting = () => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) {
            return;
        }
        dispatch(deleteJobPostingAction());
    }


    return (
        <ErrorBoundary>
            <form onSubmit={onSubmit}>
                <div className="row g-3 sticky-top align-items-center mb-3 bg-light">
                    <h3 className="col">
                        {title || 'Position Title'}
                        <JobPostingIcon id={id} changed={changed} datePosted={datePosted} validThrough={validThrough}/>
                    </h3>
                    <div className="col-auto">
                        <FormCheck label="Enabled" checked={enabled}
                                   onChange={(checked) => onChange('enabled', checked)}/>
                    </div>
                </div>
                <div>
                    <FormRow label="Title">
                        <Input value={title} onChange={(value) => onChange('title', value)}
                               required
                               placeholder="Job Posting Title"/>
                    </FormRow>
                    <FormRow label="Date Posted">
                        <DateInput value={datePosted || ''} required
                                   onChange={(value) => onChange('datePosted', value || null)}
                                   placeholder="Date Posted"/>
                        <small className="text-muted">
                            You can set a future date to schedule a job posting. Posting a date in the future is a good
                            way to preview the posting before making it live.
                        </small>
                    </FormRow>
                    <FormRow label="Valid Through">
                        <DateInput value={validThrough || ''}
                                   onChange={(value) => onChange('validThrough', value || null)}
                                   min={datePosted || ''}
                                   placeholder="Valid Through"/>
                        <small className="text-muted">
                            You can turn off a posting be setting it's '<strong>valid through</strong>' date to a date
                            in the past. Once the '<strong>valid through</strong>' date is passed, the posting will
                            no longer be shown on the websites.
                        </small>
                    </FormRow>
                    <FormRow label="Job Description PDF">
                        {!!filename && (
                            <div className="row g-3">
                                <div className="col">
                                    <a href={`https://intranet.chums.com/pdf/jobs/${filename}`} target="_blank">Download</a>
                                </div>
                                <div className="col-auto">
                                    <button type="button" className="btn btn-sm btn-outline-secondary"
                                            onClick={() => onChange('filename', '')}>
                                        Upload new file
                                    </button>
                                </div>
                            </div>

                        )}
                        {!filename && <JobPostingPDFSelector/>}
                    </FormRow>
                    <FormRow label="Job Description">
                        <GUIEditor value={description} onChange={(value) => onChange('description', value)}
                                   onChangeTimer={30000}/>
                        <small className="text-muted">
                            When pasting from Word, you must replace the bullet dots with the list dots in the above
                            toolbar.
                            When copying from PDF, you must also remove any unwanted line breaks.
                        </small>
                    </FormRow>
                    <FormRow label="Job Location">
                        <Select value={jobLocation}
                                onChange={(value) => onChange('jobLocation', value)}
                                className="form-select form-select-sm">
                            <option value="">Select a Location</option>
                            <option value="slc">Salt Lake City, UT</option>
                            <option value="ketchum">Ketchum, ID</option>
                            <option value="hurricane">Hurricane, UT</option>
                            <option value="telecommute">Telecommute</option>
                        </Select>
                        {jobLocation === 'telecommute' && (
                            <small className="text-muted">
                                Jobs marked as TELECOMMUTE must be fully remote. Don't mark up jobs that allow
                                occasional work-from-home, jobs for which remote work is a negotiable benefit, or
                                have other arrangements that are not 100% remote. The "gig economy" nature of a job
                                doesn't imply that it is or is not remote.
                                <strong>The job description must clearly state that the job is 100% remote.</strong>
                            </small>
                        )}
                    </FormRow>
                    <FormRow label="Employment Type">
                        <Select value={employmentType || ''}
                                onChange={value => onChange('employmentType', value)}
                                className="form-select form-select-sm">
                            <option value="">Select One</option>
                            {Object.keys(EmploymentTypes).map((key) => (
                                <option key={key} value={key}>{EmploymentTypes[key as ValidEmploymentType]}</option>
                            ))}
                        </Select>
                    </FormRow>
                    <FormRow label="Education Requirements">
                        <Input id="jp--education-requirements" value={educationalRequirements}
                               onChange={(value) => onChange('educationalRequirements', value)}
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
                    </FormRow>
                    <FormRow label="Experience Requirements">
                        <div className="row g-3">
                            <div className="col-auto">
                                <div className="input-group input-group-sm">
                                    <Input type="number" min="0" value={experienceRequirements}
                                           onChange={(value) => onChange('experienceRequirements', Number(value))}/>
                                    <span className="input-group-text">Months</span>
                                </div>
                            </div>
                            <div className="col-auto">
                                <FormCheck label="Allow Experience in place of Education"
                                           checked={experienceInPlaceOfEducation} inline
                                           type="checkbox"
                                           onChange={(checked) => onChange('experienceInPlaceOfEducation', checked)}/>
                            </div>
                        </div>
                    </FormRow>
                    <FormRow label="Application Instructions">
                        <TextArea value={applicationInstructions || ''} onChange={(value) => onChange('applicationInstructions', value)} />
                    </FormRow>
                    <FormRow label="Email Recipient">
                        <div className="row g-3">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">@</span>
                                <Input type="email" value={emailRecipient || ''}
                                       placeholder="jobs@chums.com"
                                       onChange={(value) => onChange('emailRecipient', value)}/>
                            </div>
                            <small>Defaults to jobs@chums.com; enter a different address to override.</small>
                        </div>
                    </FormRow>

                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-primary me-3">Save</button>
                    <button type="button" className="btn btn-outline-secondary me-3" onClick={onNewPosting}>
                        New Posting
                    </button>
                    <button type="button" className="btn btn-outline-danger me-3" onClick={onDeletePosting} disabled={id === 0}>
                        Delete Posting
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    )
}

export default JobPostingEditor;
