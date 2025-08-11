import Alert from "react-bootstrap/Alert";

interface JobDateProps {
    date: string|Date|null,
    schemaTag: 'datePosted'|'validThrough'|'jobStartDate',
}

const JobDate = ({date, schemaTag}:JobDateProps) => {
    if (!date || !new Date(date).getTime()) {
        return (
            <Alert variant="warning" title="Warning">Invalid date for field '{schemaTag}'</Alert>
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
