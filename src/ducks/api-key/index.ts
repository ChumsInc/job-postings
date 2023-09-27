import {fetchJSON} from "chums-components";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";

export interface ApiKeyState {
    tinyMCE: string | null;
    loading: boolean;
}

export const initialState: ApiKeyState = {
    tinyMCE: null,
    loading: false,
}

async function fetchTinyMCEAPIKey(): Promise<string | null> {
    try {
        const response = await fetchJSON<{ key: string | null }>('/api/keys/tiny-mce.json');
        return response.key ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchTinyAPIKey()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchTinyAPIKey()", err);
        return Promise.reject(new Error('Error in fetchTinyAPIKey()'));
    }
}
export const selectTinyMCEKey = (state:RootState) => state.apiKeys.tinyMCE;
export const selectKeysLoading = (state:RootState) => state.apiKeys.loading;

export const loadTinyMCEKey = createAsyncThunk<string | null>(
    'api-keys/loadTinyMCE',
    async () => {
        return await fetchTinyMCEAPIKey();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeysLoading(state);
        }
    }
)

const apiKeysReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadTinyMCEKey.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadTinyMCEKey.fulfilled, (state, action) => {
            state.loading = false;
            state.tinyMCE = action.payload;
        })
        .addCase(loadTinyMCEKey.rejected, (state) => {
            state.loading = false;
        })
});

export default apiKeysReducer;
