import { IndexedDBProps } from '../hooks/IndexedDB';
import { ErrorListType } from '../hooks/useErrorChecklist';
import { WarningListType } from '../hooks/useWarningChecklist';
import { DocumentInfo, HTMLHeading } from '../types/Execution';
import { dbName, storageName } from './GlobalUtils';

export const DBConfig: IndexedDBProps = {
    name: dbName,
    version: 1,
    objectStoresMeta: [
        {
            store: storageName,
            storeConfig: { keyPath: 'TabId', autoIncrement: false },
            storeSchema: [
                { name: 'TabId', keypath: 'TabId', options: { unique: true } },
                { name: 'Url', keypath: 'Url', options: { unique: false } },
                {
                    name: 'ActiveTab',
                    keypath: 'ActiveTab',
                    options: { unique: false },
                },
                {
                    name: 'WarningList',
                    keypath: 'WarningList',
                    options: { unique: false },
                },
                {
                    name: 'ErrorList',
                    keypath: 'ErrorList',
                    options: { unique: false },
                },
                {
                    name: 'DocumentInfo',
                    keypath: 'DocumentInfo',
                    options: { unique: false },
                },
            ],
        },
    ],
};

export interface DbSchema {
    TabId: number;
    Url: string;
    ActiveTab?: string;
    ErrorList?: ErrorListType;
    WarningList?: WarningListType;
    DocumentInfo: Omit<DocumentInfo, 'countHeader'>;
}
