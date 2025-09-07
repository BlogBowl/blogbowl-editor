import { AxiosResponse } from 'axios';

export const request = async <DataType, ApiError = any>(
    promise: Promise<AxiosResponse<DataType>>,
): Promise<[DataType, null] | [null, ApiError]> => {
    try {
        const data = await promise;
        return [data.data, null];
    } catch (error: any) {
        return [null, error.response || true];
    }
};

export const formatFormDataWithFiles = (
    data: any,
    fileKeys: string[],
): FormData => {
    const formData = new FormData();

    for (const key in data) {
        if (fileKeys.includes(key)) {
            if (!data[key]?.[0]) {
                continue;
            }
            formData.append(key, data[key][0]);
        } else if (Array.isArray(data[key])) {
            for (const item of data[key]) {
                formData.append(`${key}[]`, item);
            }
        } else {
            formData.append(key, data[key]);
        }
    }

    return formData;
};
