import React, {type ChangeEvent, useId} from "react";
import {useSelector} from "react-redux";
import {selectCurrentPosting} from "./index";
import {loadJobPosting, removeJobPosting, saveJobPosting, updateJobPosting,} from "./actions";
import classNames from "classnames";
import {ErrorBoundary} from "react-error-boundary";
import GUIEditor2 from "../../components/GUIEditor2";
import JobPostingPDFSelector from "./JobPostingPDFSelector";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";
import {useAppDispatch} from "@/app/configureStore";
import {type JobPosting, type ValidEmploymentType} from "../../types";
import dayjs from "dayjs";
import {EmploymentTypes} from "./utils";
import {Badge, Form, FormControl, FormSelect, FormText, InputGroup, Stack} from "react-bootstrap";
import FormCheck from "react-bootstrap/FormCheck";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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
        <Badge bg={changed ? 'warning' : undefined} className="ms-3"><span className={classNames(className)}/></Badge>
    )
}
const JobPostingEditor = () => {
    const dispatch = useAppDispatch();
    const posting = useSelector(selectCurrentPosting);
    const titleId = useId();
    const jobPostingDateId = useId();
    const validThruId = useId();
    const filenameId = useId();

    const changeHandler = (field: keyof JobPosting) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'datePosted':
                return dispatch(updateJobPosting({
                    [field]: dayjs(ev.target.valueAsDate).isValid()
                        ? dayjs(ev.target.valueAsDate).add(new Date().getTimezoneOffset(), 'minutes').startOf('day').toISOString()
                        : null
                }))
            case 'validThrough':
                return dispatch(updateJobPosting({
                    [field]: dayjs(ev.target.valueAsDate).isValid()
                        ? dayjs(ev.target.valueAsDate).add(new Date().getTimezoneOffset(), 'minutes').endOf('day').toISOString()
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
            <Form onSubmit={onSubmit}>
                <div className="row g-3 sticky-top align-items-center mb-3">
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
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label htmlFor={titleId} column sm={3}>Title</Form.Label>
                        <Col sm={9}>
                            <FormControl value={posting.title} onChange={changeHandler('title')}
                                         size="sm" id={titleId}
                                         required
                                         placeholder="Job Posting Title"/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label htmlFor={jobPostingDateId} column sm={3}>Date Posted</Form.Label>
                        <Col sm={9}>
                            <FormControl type="date" size="sm" id={jobPostingDateId}
                                         value={dayjs(posting.datePosted).isValid()
                                             ? dayjs(posting.datePosted).format('YYYY-MM-DD')
                                             : ''}
                                         required
                                         onChange={changeHandler('datePosted')}
                                         placeholder="Date Posted"/>
                            <FormText className="text-secondary">
                                You can set a future date to schedule a job posting. Posting a date in the future is a
                                good
                                way to preview the posting before making it live.
                            </FormText>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} html={validThruId}>Valid Through</Form.Label>
                        <Col sm={9}>
                            <FormControl type="date" size="sm" id={validThruId}
                                         value={dayjs(posting.validThrough).isValid() ? dayjs(posting.validThrough).format('YYYY-MM-DD') : ''}
                                         onChange={changeHandler('validThrough')}
                                         min={dayjs(posting.datePosted).isValid() ? dayjs(posting.datePosted).format('YYYY-MM-DD') : ''}
                                         placeholder="Valid Through"/>
                            <FormText className="text-secondary">
                                You can turn off a posting be setting it's '<strong>valid through</strong>' date to a
                                date
                                in the past. Once the '<strong>valid through</strong>' date is passed, the posting will
                                no longer be shown on the websites.
                            </FormText>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} htmlFor={filenameId}>Job Description PDF</Form.Label>
                        <Col xs={9}>
                            {!!posting.filename && (
                                <div className="row g-3">
                                    <div className="col">
                                        <a href={`https://intranet.chums.com/pdf/jobs/${posting.filename}`}
                                           target="_blank">Download</a>
                                    </div>
                                    <div className="col-auto">
                                        <Button type="button" size="sm" variant="primary" onClick={clearFilename}>
                                            Upload new file
                                        </Button>
                                    </div>
                                </div>

                            )}
                            {!posting.filename && <JobPostingPDFSelector/>}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Job Description</Form.Label>
                        <Col sm={9}>
                            <GUIEditor2 value={posting.description} onChange={guiChangeHandler}
                                        onChangeTimer={30000}/>
                            <FormText className="text-secondary">
                                When pasting from Word, you must replace the bullet dots with the list dots in the above
                                toolbar.
                                When copying from PDF, you must also remove any unwanted line breaks.
                            </FormText>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Job Location</Form.Label>
                        <Col sm={9}>
                            <FormSelect value={posting.jobLocation} onChange={selectChangeHandler('jobLocation')}
                                        size="sm">
                                <option value="">Select a Location</option>
                                <option value="slc">Salt Lake City, UT</option>
                                <option value="ketchum">Ketchum, ID</option>
                                <option value="hurricane">Hurricane, UT</option>
                                <option value="telecommute">Telecommute</option>
                            </FormSelect>
                            {posting.jobLocation === 'telecommute' && (
                                <FormText className="text-secondary">
                                    Jobs marked as TELECOMMUTE must be fully remote. Don't mark up jobs that allow
                                    occasional work-from-home, jobs for which remote work is a negotiable benefit, or
                                    have other arrangements that are not 100% remote. The "gig economy" nature of a job
                                    doesn't imply that it is or is not remote.
                                    <strong>The job description must clearly state that the job is 100% remote.</strong>
                                </FormText>
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Employment Type</Form.Label>
                        <Col sm={9}>
                            <FormSelect value={posting.employmentType || ''}
                                        onChange={selectChangeHandler('employmentType')}
                                        size="sm">
                                <option value="">Select One</option>
                                {Object.keys(EmploymentTypes).map((key) => (
                                    <option key={key} value={key}>{EmploymentTypes[key as ValidEmploymentType]}</option>
                                ))}
                            </FormSelect>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3} htmlFor="jp--education-requirements">
                            Education Requirements
                        </Form.Label>
                        <Col sm={9}>
                            <FormControl id="jp--education-requirements" size="sm"
                                         value={posting.educationalRequirements}
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
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Exp. Requirements</Form.Label>
                        <Col sm={9}>
                            <InputGroup size="sm">
                                <FormControl type="number" size="sm"
                                             value={posting.experienceRequirements ?? '0'}
                                             onChange={changeHandler('experienceRequirements')}/>
                                <InputGroup.Text>Months</InputGroup.Text>
                            </InputGroup>
                            <FormCheck label="Allow Experience in place of Education"
                                       checked={posting.experienceInPlaceOfEducation}
                                       type="checkbox"
                                       onChange={changeHandler('experienceInPlaceOfEducation')}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Application Instructions</Form.Label>
                        <Col sm={9}>
                            <FormControl as="textarea" value={posting.applicationInstructions || ''}
                                         onChange={changeHandler('applicationInstructions')}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" label="Email Recipient">
                        <Form.Label column sm={3}>Email Recipient</Form.Label>
                        <Col sm={9}>
                            <InputGroup size="sm">
                                <InputGroup.Text className="input-group-text">@</InputGroup.Text>
                                <FormControl type="email" size="sm"
                                             value={posting.emailRecipient || ''}
                                             placeholder="jobs@chums.com"
                                             onChange={changeHandler('emailRecipient')}/>
                            </InputGroup>
                            <Form.Text className="text-secondary">Defaults to jobs@chums.com; enter a different address
                                to override.</Form.Text>
                        </Col>
                    </Form.Group>

                </div>
                <Stack direction="horizontal" gap={3} className="mt-3 justify-content-end">
                    <Button type="button" size="sm" variant="outline-danger" onClick={onDeletePosting}
                            disabled={posting.id === 0}>
                        Delete Posting
                    </Button>
                    <Button type="button" size="sm" variant="outline-secondary" onClick={onNewPosting}>
                        New Posting
                    </Button>
                    <Button type="submit" variant="primary" size="sm">Save</Button>
                </Stack>
            </Form>
        </ErrorBoundary>
    )
}

export default JobPostingEditor;
