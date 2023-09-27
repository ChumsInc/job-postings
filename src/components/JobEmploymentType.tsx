import React from 'react';
import {ValidEmploymentType} from "../types";
import {EmploymentTypes} from "../ducks/jobs/utils";

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
