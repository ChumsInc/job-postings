import React, {ChangeEvent, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentPosting, selectCurrentStatus} from "./index";
import {uploadJobPDF} from "./actions";
import {useAppDispatch} from "../../app/configureStore";

const JobPostingPDFSelector = () => {
    const dispatch = useAppDispatch();
    const posting = useSelector(selectCurrentPosting);
    const status = useSelector(selectCurrentStatus);

    const inputEl = useRef(null);
    const [files, setFiles] = useState(undefined as any);
    const onSelectFile = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev && ev.currentTarget && ev.currentTarget.files) {
            setFiles(ev.currentTarget.files);
        }
    }
    const onUpload = () => {
        dispatch(uploadJobPDF(files));
    }

    return (
        <>
            <div className="input-group input-group-sm">
                <input type="file" className="form-control form-control-sm" disabled={!posting.id || status !== 'idle'}
                       accept="application/pdf"
                       value={undefined}
                       ref={inputEl}
                       onChange={onSelectFile}/>
                <button className="btn btn-sm btn-primary" type="button" onClick={onUpload}>Upload</button>
            </div>
            {!posting.id && (
                <small className="text-muted">
                    This job posting must be saved before attaching a PDF file.
                </small>
            )}
        </>
    )

}
export default JobPostingPDFSelector;
