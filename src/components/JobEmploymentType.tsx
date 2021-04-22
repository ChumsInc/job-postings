import React from 'react';
import {EmploymentTypes, ValidEmploymentType} from "../ducks/jobs";

interface JobEmploymentTypeProps {
    type: ValidEmploymentType,
}
const JobEmploymentType:React.FC<JobEmploymentTypeProps> = ({type}) => {
    return (
        <div>
            {EmploymentTypes[type]}
        </div>
    );
};

export default JobEmploymentType;
