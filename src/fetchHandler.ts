

export async function fetchHandler(request:RequestInfo, options?:RequestInit):Promise<any|Error> {
    try {
        if (!options) {
            options = {};
        }
        if (options.method?.toLowerCase() === 'post') {
            options.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers || {},
            }
            if (options.body && typeof options.body === 'object') {
                options.body = JSON.stringify(options.body);
            }
        }
        const res = await fetch(request, {cache: 'no-cache', credentials: 'same-origin', ...options});
        if (!res.ok) {
            return Promise.reject(new Error(`[${res.status}] ${res.statusText}`));
        }
        const json = await res.json();
        if (json.error) {
            return Promise.reject(new Error(json.error));
        }
        return json;
    } catch(err) {
        console.debug("fetchGET()", err.message);
        return Promise.reject(err);
    }
}
