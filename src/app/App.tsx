import React from 'react';
import JobPostingsList from "../ducks/jobs/JobPostingsList";
import JobPostingEditor from "../ducks/jobs/JobPostingEditor";
import JobPostingPreview from "../ducks/jobs/JobPostingPreview";


const App = () => {
    return (
        <div className="row g-3">
            <div className="col-4 col-md-3">
                <JobPostingsList />
            </div>
            <div className="col-4 col-md-5">
                <JobPostingEditor />
            </div>
            <div className="col-4 col-md-4">
                <JobPostingPreview />
            </div>
        </div>
    )
}
export default App;
