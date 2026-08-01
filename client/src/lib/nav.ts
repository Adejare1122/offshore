export function navigateWithData(path: string, data: unknown) {
    try {
        sessionStorage.setItem(`${path}_payload`, JSON.stringify(data));
    } catch { }
    window.location.href = path;
}

export function readNavData<T = unknown>(path: string): T | null {
    try {
        const raw = sessionStorage.getItem(`${path}_payload`);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}

