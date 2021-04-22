import React, {useState} from "react";
import {Provider, useSelector} from "react-redux";
import {renderToStaticMarkup} from 'react-dom/server';
import {selectSelectedJobPosting} from "./index";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {a11yDark} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import FormCheck from "../../components/FormCheck";
import {createStore} from "redux";
import {default as reducer} from "../index";
import JobPostingRender from "../../components/JobPostingRender";
import pretty from "pretty";

const JobPostingPreview: React.FC = () => {
    const selected = useSelector(selectSelectedJobPosting);
    const [viewAsRaw, setViewAsRaw] = useState(true);
    const content = viewAsRaw
        ? (renderToStaticMarkup(
            <Provider store={createStore(reducer)}>
                <JobPostingRender selected={selected}/>
            </Provider>
        ))
        : null;
    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">
                    <FormCheck label="Show Raw Markup" type="checkbox" onChange={setViewAsRaw} checked={viewAsRaw}/>
                </div>
            </div>
            {viewAsRaw && (
                <SyntaxHighlighter language="JavaScript" style={a11yDark} showLineNumbers wrapLines={true}>
                    {pretty(content || '')}
                </SyntaxHighlighter>
            )}
            {!viewAsRaw && (
                <JobPostingRender selected={selected}/>
            )}
        </div>
    )
}

export default JobPostingPreview;
