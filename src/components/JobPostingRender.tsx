import React from "react";
import {EmploymentTypes, JobPosting} from "../ducks/jobs";
import {default as JobLocation, jobLocationLD} from "./JobLocation";
import JobDate from "./JobDate";
import EducationalRequirements from "./EducationalRequirements";
import ErrorBoundary from "chums-ducks/dist/components/ErrorBoundary";
import './job-openings.css'
import {Alert} from "chums-ducks";

interface JobPostingProps {
    posting: JobPosting
}

const JobPostingRender: React.FC<JobPostingProps> = ({posting}) => {
    const {
        id,
        title,
        jobLocation,
        datePosted,
        employmentType,
        description,
        validThrough,
        educationalRequirements,
        experienceRequirements,
        experienceInPlaceOfEducation,
        emailRecipient,
        filename,
        applicationInstructions,
        timestamp,
    } = posting;

    const ldJSON: object = {
        "@context": 'https://schema.org/',
        '@type': 'JobPosting',
        hiringOrganization: {
            "@type": 'Organization',
            name: 'Chums, Inc',
            sameAs: 'https://chums.com',
            logo: "https://intranet.chums.com/images/chums-logo-badge-400px.png",
        },
        title,
        specialCommitments: 'VeteranCommit, MilitarySpouseCommit',
        description,
        datePosted,
        validThrough,
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                ...jobLocationLD(jobLocation),
            }
        },
        employmentType,
        educationalRequirements,
        experienceRequirements: {
            monthsOfExperience: experienceRequirements,
        },
        experienceInPlaceOfEducation,
    }

    return (
        <ErrorBoundary>
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ldJSON)}}/>
            <section className="job-opening" id={'job-posting--' + id}>
                <h2 className="job-opening--title">{title}</h2>
                <section>
                    <h3>Location</h3>
                    <JobLocation location={jobLocation}/>
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
                        <li>Education: <strong><EducationalRequirements value={educationalRequirements || 'No Requirements'} /></strong></li>
                        {!!experienceRequirements && (<li>Experience: <strong>{experienceRequirements} Months</strong></li>)}
                        {experienceInPlaceOfEducation && (<li>Allow Experience in place of education:{' '}<strong>Yes</strong></li>)}
                    </ul>
                </section>
                <section>
                    <h3>How to Apply</h3>
                    {!filename && (
                        <Alert title="Uh oh!" color="warning">The job description has not been uploaded.</Alert>
                    )}
                    <ul>
                        {!!filename && (
                            <li>
                                <a href={`https://intranet.chums.com/pdf/jobs/${filename}`} target="_blank">Download Job Description</a>
                            </li>
                        )}
                        {!!applicationInstructions && (
                            <li>
                                {applicationInstructions}
                            </li>
                        )}
                        <li>
                            <a href={`mailto:${emailRecipient || 'jobs@chums.com'}?subject=${encodeURIComponent(title)}`} target="_blank">
                                Email your resume to {emailRecipient || 'jobs@chums.com'}
                            </a>
                        </li>
                    </ul>
                </section>
                <small>Last Updated: {new Date(timestamp).toLocaleString()}</small>

            </section>
        </ErrorBoundary>
    )
}
export default JobPostingRender;
