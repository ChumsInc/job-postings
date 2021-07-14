import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './components/App';
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './ducks';
import {Provider} from "react-redux";

const composeEnhancers = composeWithDevTools({});
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('job-openings')
);

// ReactDOM.render(
//     <h1>
//         hello!
//     </h1>,
//     document.getElementById('app')
// );
