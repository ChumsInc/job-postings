import React from "react";


interface JobLocationType {
    streetAddress: string,
    addressLocality: string,
    addressRegion: string,
    postalCode: string,
    addressCountry: string,
}

const Hurricane: JobLocationType = {
    streetAddress: '104 S. Main Street',
    addressLocality: 'Hurricane',
    addressRegion: 'UT',
    postalCode: '84737',
    addressCountry: 'US'
}

const SLC: JobLocationType = {
    streetAddress: '2424 South 2570 West',
    addressLocality: 'West Valley City',
    addressRegion: 'UT',
    postalCode: '84119',
    addressCountry: 'US'
}

const Ketchum: JobLocationType = {
    streetAddress: '210 East Sun Valley Road',
    addressLocality: 'Ketchum',
    addressRegion: 'ID',
    postalCode: '83340',
    addressCountry: 'US'
}

export const jobLocationLD = (name: string): JobLocationType => {
    switch (name) {
    case 'hurricane':
        return Hurricane;
    case 'ketchum':
        return Ketchum;
    case 'slc':
    default:
        return SLC;
    }
}

interface JobLocationProps {
    location: string,
}

const JobLocation: React.FC<JobLocationProps> = ({location}) => {
    const {streetAddress, addressLocality, addressRegion, postalCode} = jobLocationLD(location);
    return (
        <div property="jobLocation" typeof="Place">
            <address property="address" typeof="PostalAddress">
                <div property="streetAddress">{streetAddress}</div>
                <div>
                    <span property="addressLocality">{addressLocality}</span>,
                    {' '}
                    <span property="addressRegion">{addressRegion}</span>
                    {' '}
                    <span property="postalCode">{postalCode}</span>
                </div>
            </address>
        </div>
    )
}
export default JobLocation;
