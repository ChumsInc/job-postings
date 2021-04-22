import React from "react";
import {EmploymentTypes, JobPosting} from "../ducks/jobs";
import {default as JobLocation, jobLocationLD} from "./JobLocation";
import JobDate from "./JobDate";

interface JobPostingProps {
    selected: JobPosting
}

const JobPostingRender: React.FC<JobPostingProps> = ({selected}) => {
    const {
        title,
        jobLocation,
        datePosted,
        employmentType,
        description,
        validThrough,
        educationalRequirements,
        experienceRequirements,
        experienceInPlaceOfEducation
    } = selected;
    const ldJSON: object = {
        "@context": 'https://schema.org/',
        '@type': 'JobPosting',
        title,
        description,
        hiringOrganization: {
            "@type": 'Organization',
            name: 'Chums, Inc',
            sameAs: 'https://chums.com',
        },
        datePosted,
        validThrough,
        employmentType,
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                ...jobLocationLD(jobLocation),
            }
        }
    }
    return (
        <div vocab="https://schema.org" typeof="JobPostingRender">
            <meta property="specialCommitments" content="VeteranCommit"/>
            <h2 property="title">{title}</h2>
            <div>
                <h3>Location</h3>
                <JobLocation location={jobLocation}/>
            </div>
            <div>
                <h3>Date Posted</h3>
                <div>
                    <JobDate date={datePosted} schemaTag='datePosted'/>
                </div>
            </div>
            <div>
                <h3>Employment Type</h3>
                <div property="employmentType">
                    {EmploymentTypes[employmentType]}
                </div>
            </div>
            <div>
                <h3>Description</h3>
                <div property="description" dangerouslySetInnerHTML={{__html: description}}/>
            </div>
        </div>
    )
}
export default JobPostingRender;
