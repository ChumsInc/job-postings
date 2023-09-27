export interface PropType {
    [key:string]: any
}


export declare type ValidEmploymentType =
    'FULL_TIME'
    | 'PART_TIME'
    | 'CONTRACTOR'
    | 'TEMPORARY'
    | 'INTERN'
    | 'VOLUNTEER'
    | 'PER_DIEM'
    | 'OTHER';

export type EmploymentTypeMap = { [employmentType in ValidEmploymentType]: string }

export interface BaseSalary {
    value?: number,
    minValue?: number,
    maxValue?: number,
    unitText: string,
}

export interface JobPosting {
    id: number,
    title: string,
    enabled: boolean,
    description: string,
    datePosted: string | null,
    jobLocation: string,
    validThrough: string | null,
    baseSalary?: BaseSalary | null,
    employmentType: ValidEmploymentType,
    educationalRequirements: string,
    experienceRequirements: number
    experienceInPlaceOfEducation: boolean,
    filename: string,
    emailRecipient?: string,
    applicationInstructions?: string,
    timestamp: string,
    changed?: boolean,
}
