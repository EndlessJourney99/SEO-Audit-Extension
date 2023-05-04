import { RequestMessage } from '../types/Execution';

const dbName = 'FPExtensionDB';
const storageName = 'MetaSEO';

function readCsvFile<T>(file: File): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const csvString = event.target?.result as string;
            const lines = csvString.split('\n');
            const headers = lines[0].split(',');
            const data = new Array<T>();

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].split(',');
                let row: any = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = line[j];
                }
                data.push(row as T);
            }

            resolve(data);
        };

        reader.onerror = (event) => {
            reject(event.target?.error);
        };

        reader.readAsText(file);
    });
}

function CreateGuid() {
    function _p8(s: boolean) {
        var p = (Math.random().toString(16) + '000000000').substring(2, 8);
        return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
    }
    return _p8(false) + _p8(true) + _p8(false) + _p8(true) + _p8(false);
}

function Since(amount: number, type: 'days' | 'hours' | 'minutes') {
    const now = new Date();
    if (type === 'days') now.setDate(now.getDate() - amount);
    else if (type === 'hours') now.setHours(now.getHours() - amount);
    else if (type === 'minutes') now.setMinutes(now.getMinutes() - amount);
    return now.getTime();
}

function randomRange(min: number, max: number): number {
    return Math.ceil(min + Math.random() * (max - min));
}

function isValidUrl(urlStr: string): boolean {
    try {
        if (urlStr === 'javascript:(0)' || urlStr === 'javascript:;')
            return false;
        new URL(urlStr);
        return true;
    } catch {
        return false;
    }
}

function GetImageRealSrc(imgElement: HTMLImageElement): string {
    if (
        imgElement.src.length === 0 ||
        imgElement.src.startsWith('data:image/')
    ) {
        if (imgElement.getAttribute('data-lazy-src')?.length)
            return imgElement.getAttribute('data-lazy-src')!;
        if (imgElement.getAttribute('data-src')?.length)
            return imgElement.getAttribute('data-src')!;
        if (imgElement.getAttribute('data-lazy')?.length)
            return imgElement.getAttribute('data-lazy')!;
    }
    return imgElement.src;
}

export {
    readCsvFile,
    storageName,
    Since,
    CreateGuid,
    dbName,
    randomRange,
    isValidUrl,
    GetImageRealSrc,
};
