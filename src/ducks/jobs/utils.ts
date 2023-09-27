import {EmploymentTypeMap, JobPosting} from "../../types";

export const defaultJobPosting: JobPosting = {
    id: 0,
    title: '',
    enabled: false,
    description: '',
    datePosted: null,
    jobLocation: '',
    validThrough: null,
    baseSalary: null,
    employmentType: 'FULL_TIME',
    educationalRequirements: '',
    experienceRequirements: 0,
    experienceInPlaceOfEducation: true,
    emailRecipient: '',
    filename: '',
    applicationInstructions: '',
    timestamp: '',
}

export const EmploymentTypes: EmploymentTypeMap = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACTOR: 'Contractor',
    TEMPORARY: 'Temporary',
    INTERN: 'Intern',
    VOLUNTEER: 'Volunteer',
    PER_DIEM: 'Per Diem',
    OTHER: 'Other',
}
