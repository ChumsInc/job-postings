import type {JobPosting} from "@/src/types.ts";
import {jobLocationLD} from "@/components/JobLocation.tsx";

export interface JobPostingLDProps {
    posting: JobPosting
}
export default function JobPostingLD({posting}:JobPostingLDProps) {
    const ldJSON: object = {
        "@context": 'https://schema.org/',
        '@type': 'JobPosting',
        hiringOrganization: {
            "@type": 'Organization',
            name: 'Chums, Inc',
            sameAs: 'https://chums.com',
            logo: "https://intranet.chums.com/images/chums-logo-badge-400px.png",
        },
        title: posting.title,
        specialCommitments: 'VeteranCommit, MilitarySpouseCommit',
        description: posting.description,
        datePosted: posting.datePosted,
        validThrough: posting.validThrough,
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                ...jobLocationLD(posting.jobLocation),
            }
        },
        employmentType: posting.employmentType,
        educationalRequirements: posting.educationalRequirements,
        experienceRequirements: {
            monthsOfExperience: posting.experienceRequirements,
        },
        experienceInPlaceOfEducation: posting.experienceInPlaceOfEducation,
    }
    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(ldJSON)}}/>
    )
}
