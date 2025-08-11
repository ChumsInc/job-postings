import React from "react";
import type {JobPosting} from "../types";
import JobDate from "./JobDate";
import EducationalRequirements from "./EducationalRequirements";
import {ErrorBoundary} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";
import {EmploymentTypes} from "../ducks/jobs/utils";
import ErrorBoundaryFallbackAlert from "../app/ErrorBoundaryFallbackAlert";
import JobPostingContainer from "@/components/JobPostingContainer.ts";
import JobLocationAddress from "@/components/JobLocationAddress.tsx";
import JobPostingLD from "@/components/JobPostingLD.tsx";

interface JobPostingProps {
    posting: JobPosting
}

const JobPostingRender: React.FC<JobPostingProps> = ({posting}) => {
    const jobPostingId = `job-posting--${posting.id}`;
    const {
        title,
        jobLocation,
        datePosted,
        employmentType,
        description,
        educationalRequirements,
        experienceRequirements,
        experienceInPlaceOfEducation,
        emailRecipient,
        filename,
        applicationInstructions,
        timestamp,
    } = posting;


    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <JobPostingContainer>
                <JobPostingLD posting={posting}/>
                <section className="job-opening" id={jobPostingId}>
                    <h2 className="job-opening--title">{title}</h2>
                    <section>
                        <h3>Location</h3>
                        <JobLocationAddress location={jobLocation}/>
                    </section>
                    <section>
                        <h3>Date Posted</h3>
                        <div>
                            <JobDate date={datePosted} schemaTag='datePosted'/>
                        </div>
                    </section>
                    <section>
                        <h3>Employment Type</h3>
                        <div>
                            {EmploymentTypes[employmentType]}
                        </div>
                    </section>
                    <section className="job-opening--description">
                        <h3>Description</h3>
                        <div dangerouslySetInnerHTML={{__html: description}}/>
                    </section>
                    <section>
                        <h3>Education and Experience Requirements</h3>
                        <ul>
                            <li>Education: <strong><EducationalRequirements
                                value={educationalRequirements || 'No Requirements'}/></strong></li>
                            {!!experienceRequirements && (
                                <li>Experience: <strong>{experienceRequirements} Months</strong></li>)}
                            {experienceInPlaceOfEducation && (
                                <li>Allow Experience in place of education:{' '}<strong>Yes</strong></li>)}
                        </ul>
                    </section>
                    <section>
                        <h3>How to Apply</h3>
                        {!filename && (
                            <Alert title="Uh oh!" variant="warning">The job description has not been uploaded.</Alert>
                        )}
                        <ul>
                            {!!filename && (
                                <li>
                                    <a href={`https://intranet.chums.com/pdf/jobs/${filename}`} target="_blank">Download
                                        Job Description</a>
                                </li>
                            )}
                            {!!applicationInstructions && (
                                <li>
                                    {applicationInstructions}
                                </li>
                            )}
                            <li>
                                <a href={`mailto:${emailRecipient || 'jobs@chums.com'}?subject=${encodeURIComponent(title)}`}
                                   target="_blank">
                                    Email your resume to {emailRecipient || 'jobs@chums.com'}
                                </a>
                            </li>
                        </ul>
                    </section>
                    <small>Last Updated: {new Date(timestamp).toLocaleString()}</small>

                </section>
            </JobPostingContainer>
        </ErrorBoundary>
    )
}
export default JobPostingRender;
