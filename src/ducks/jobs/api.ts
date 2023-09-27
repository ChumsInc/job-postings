import {JobPosting} from "../../types";
import {fetchJSON} from "chums-components";

export const fetchJobsURL = (id?: number) => `/api/timeclock-admin/job-postings/${encodeURIComponent(String(id || ''))}`;
export const postJobPostingPDFURL = (id: number) => fetchJobsURL(id) + '/upload-pdf';

export async function fetchJobPostings(): Promise<JobPosting[]> {
    try {
        const url = fetchJobsURL();
        const response = await fetchJSON<{ postings: JobPosting[] }>(url, {cache: 'no-cache'});
        return response.postings ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchJobPostings()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchJobPostings()", err);
        return Promise.reject(new Error('Error in fetchJobPostings()'));
    }
}

export async function fetchJobPosting(id: number): Promise<JobPosting | null> {
    try {
        if (!id) {
            return null;
        }
        const url = fetchJobsURL(id);
        const response = await fetchJSON<{ postings: JobPosting[] }>(url, {cache: 'no-cache'});
        if (!response.postings || !response.postings.length) {
            return null;
        }
        return response.postings[0];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchJobPosting()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchJobPosting()", err);
        return Promise.reject(new Error('Error in fetchJobPosting()'));
    }
}

export async function postJobPosting(arg: JobPosting): Promise<JobPosting | null> {
    try {
        const url = fetchJobsURL(arg.id);
        const method = arg.id === 0 ? 'post' : 'put';
        const response = await fetchJSON<{ postings: JobPosting[] }>(url, {method, body: JSON.stringify(arg)});
        if (!response.postings || !response.postings.length) {
            return null;
        }
        return response.postings[0];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postJobPosting()", err.message);
            return Promise.reject(err);
        }
        console.debug("postJobPosting()", err);
        return Promise.reject(new Error('Error in postJobPosting()'));
    }
}

export async function deleteJobPosting(arg: number): Promise<JobPosting[]> {
    try {
        const url = fetchJobsURL(arg);
        const response = await fetchJSON<{ postings: JobPosting[] }>(url, {method: 'delete'});
        return response.postings ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteJobPosting()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteJobPosting()", err);
        return Promise.reject(new Error('Error in deleteJobPosting()'));
    }
}

export interface PostJobPDFArgs {
    id: number;
    files: FileList;
}

export async function postJobPDF(arg: PostJobPDFArgs): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const {id, files} = arg;
            if (!files.length || files.length > 1) {
                return reject(new Error('No file was selected for upload'));
            }
            const [file] = files;

            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';

            xhr.upload.addEventListener('abort', (ev) => {
                console.log(ev);
                return reject(new Error('Upload aborted'));
            });

            xhr.upload.addEventListener('error', (ev) => {
                console.log(ev);
                return reject(new Error('Upload failed'));
            });

            xhr.upload.addEventListener('timeout', (ev) => {
                console.log(ev);
                return reject(new Error('Upload timed out'));
            });

            xhr.upload.addEventListener('load', (ev) => {
                console.log(ev);
                return resolve(true);
            });

            xhr.onreadystatechange = (ev) => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const {postings, error} = xhr.response;
                    if (postings) {
                        return resolve(true);
                        // dispatch({type: saveJobPDFSucceeded, payload: {jobPosting: postings[0]}});
                    }
                    if (error) {
                        return reject(new Error(error));
                    }
                }

            };

            const formData = new FormData();
            formData.append(file.name, file, file.name);
            const url = postJobPostingPDFURL(id);
            xhr.open('POST', url, true);
            xhr.send(formData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.debug("postJobPDF()", err.message);
                return Promise.reject(err);
            }
            console.debug("postJobPDF()", err);
            return Promise.reject(new Error('Error in postJobPDF()'));
        }

    });
}

