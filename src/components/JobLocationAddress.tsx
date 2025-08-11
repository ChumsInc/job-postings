import {jobLocationLD} from "@/components/JobLocation.tsx";

interface JobLocationAddressProps {
    location: string,
}

export default function JobLocationAddress({location}:JobLocationAddressProps) {
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

