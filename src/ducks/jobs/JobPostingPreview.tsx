import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentPosting} from "./index";
import JobPostingRender from "../../components/JobPostingRender";
import {ErrorBoundary} from "react-error-boundary";
import CopyButton from "../../components/CopyButton";
import ErrorBoundaryFallbackAlert from "../../app/ErrorBoundaryFallbackAlert";


const JobPostingPreview: React.FC = () => {
    const selected = useSelector(selectCurrentPosting);
    const linkUrl = `https://intranet.chums.com/apps/current-openings/?id=${selected.id}`;
    const previewUrl = `${linkUrl}&preview=1`;
    const validateUrl = ` https://search.google.com/test/rich-results?url=${encodeURIComponent(linkUrl)}&user_agent=1`
    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <div>
                <div className="row g-3 align-items-center">
                    {!!selected.id && (
                        <>
                            <h3 className="col-auto">
                                <a href={previewUrl} target="_blank"
                                   className="btn btn-sm btn-outline-secondary">Preview</a>
                            </h3>
                            <h3 className="col-auto">
                                <a href={validateUrl} target="_blank"
                                   className="btn btn-sm btn-outline-secondary">Validate</a>
                            </h3>
                            <h3 className="col-auto">
                                <CopyButton className="btn btn-sm btn-outline-primary" disabled={!selected.enabled}
                                            copy={linkUrl}
                                            copiedText="Link Copied">
                                    Copy Link
                                </CopyButton>
                            </h3>
                        </>
                    )}
                    {!selected.id && (
                        <h3>New Posting</h3>
                    )}
                </div>
                <JobPostingRender posting={selected}/>
            </div>
        </ErrorBoundary>
    )
}

export default JobPostingPreview;
