import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import alertsReducer from "../ducks/alerts";
import jobsReducer from "../ducks/jobs";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import apiKeysReducer from "../ducks/api-key";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    apiKeys: apiKeysReducer,
    jobs: jobsReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error', 'meta.arg.signal'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
