const saveLocal = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

const importSaveLocal = (key: string) => {
    if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    return null;
}
    
export { saveLocal, importSaveLocal };