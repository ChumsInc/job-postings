import React from 'react';

const description = (value:string) => {
    switch (value) {
    case 'no requirements': return 'No Requirements';
    case 'high school': return 'High School or GED';
    case 'associates degree': return 'Associates Degree';
    case 'bachelor degree': return 'Bachelor Degree';
    case 'professional certificate':  return 'Professional Certificate';
    case 'postgraduate degree': return 'Postgraduate Degree';
    default:
        return value;
    }
}

const EducationalRequirements:React.FC<{ value: string }> = ({value}) => {
    return (
        <span>{description(value)}</span>
    )
}

export default EducationalRequirements;
