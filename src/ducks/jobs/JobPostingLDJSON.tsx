import React from "react";
import {JobPosting} from "../../types";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";

interface JobPostingLDJSONProps {
    selected: JobPosting
}

interface JobLocation {
    streetAddress: string,
    addressLocality: string,
    addressRegion: string,
    postalCode: string,
}

const Hurricane:JobLocation = {
    streetAddress: '104 S. Main Street',
    addressLocality: 'Hurricane',
    addressRegion: 'Utah',
    postalCode: '84737',
}

const SLC:JobLocation = {
    streetAddress: '2424 South 2570 West',
    addressLocality: 'West Valley City',
    addressRegion: 'Utah',
    postalCode: '84119',
}

const Ketchum:JobLocation = {
    streetAddress: '210 East Sun Valley Road',
    addressLocality: 'Ketchum',
    addressRegion: 'Idaho',
    postalCode: '83340',
}

const jobLocation = (jobLocation:string):JobLocation => {
    switch (jobLocation) {
    case 'hurricane': return Hurricane;
    case 'ketchum': return Ketchum;
    case 'slc':
    default:
        return SLC;
    }
}
const JobPostingLDJSON: React.FC<JobPostingLDJSONProps> = ({selected}) => {
    const location = jobLocation(selected.jobLocation);
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div vocab="https://schema.org" typeof="JobPostingRender">
                <meta property="specialCommitments" content="VeteranCommit" />
                <h2 property="title">{selected.title}</h2>
                <div>
                    <p>
                        <strong>Location:</strong>
                        <span property="jobLocation" typeof="Place">
                        <span property="address" typeof="PostalAddress">
                            <span property="streetAddress">{location.streetAddress}</span>
                            <span property="addressLocality">{location.addressLocality}</span>
                            <span property="addressRegion">{location.addressRegion}</span>
                            <span property="postalCode">{location.postalCode}</span>
                        </span>
                    </span>
                    </p>
                </div>
            </div>
        </ErrorBoundary>

    )
}
export default JobPostingLDJSON;
