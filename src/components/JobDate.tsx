import React from 'react';
import {Alert} from "chums-components";

interface JobDateProps {
    date: string|Date|null,
    schemaTag: 'datePosted'|'validThrough'|'jobStartDate',
}
const JobDate:React.FC<JobDateProps> = ({date, schemaTag}) => {
    if (!date || !new Date(date).getTime()) {
        return (
            <Alert color="warning" title="Warning">Invalid date for field '{schemaTag}'</Alert>
        )
    }
    return (
        <>
            <span property="datePosted" className="visually-hidden">{new Date(date).toISOString()}</span>
            <span>{new Date(date).toLocaleDateString()}</span>
        </>
    )
}
export default JobDate;
