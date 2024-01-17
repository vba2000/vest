
export const evaluate = async (nodeUrl: string, address: string, data: any) => {
    const body = data;
    const res = await fetch(`${nodeUrl}utils/script/evaluate/${address}`, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    try {
        const result = await res.json();
        return result;
    } catch (e) {
        throw e;
    }
};