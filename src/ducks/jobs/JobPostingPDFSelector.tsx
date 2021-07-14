import React, {ChangeEvent, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectLoadingSelected, selectSelectedJobPosting} from "./index";
import {uploadJobPDFAction} from "./actions";

const JobPostingPDFSelector: React.FC = () => {
    const {id} = useSelector(selectSelectedJobPosting);
    const loading = useSelector(selectLoadingSelected);
    const dispatch = useDispatch();

    const inputEl = useRef(null);
    const [files, setFiles] = useState(undefined as any);
    const onSelectFile = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev && ev.currentTarget && ev.currentTarget.files) {
            setFiles(ev.currentTarget.files);
        }
    }
    const onUpload = () => {
        dispatch(uploadJobPDFAction(files));
    }

    return (
        <>
            <div className="input-group input-group-sm">
                <input type="file" className="form-control form-control-sm" disabled={!id || loading}
                       accept="application/pdf"
                       value={undefined}
                       ref={inputEl}
                       onChange={onSelectFile}/>
                <button className="btn btn-sm btn-primary" type="button" onClick={onUpload}>Upload</button>
            </div>
            {!id && (
                <small className="text-muted">
                    This job posting must be saved before attaching a PDF file.
                </small>
            )}

        </>
    )

}
export default JobPostingPDFSelector;
