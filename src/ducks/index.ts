import {combineReducers} from "redux";
import {default as alertsReducer} from 'chums-ducks/dist/ducks/alerts';
import {default as jobsReducer} from './jobs'

const rootReducer = combineReducers({
    alerts: alertsReducer,
    jobs: jobsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
