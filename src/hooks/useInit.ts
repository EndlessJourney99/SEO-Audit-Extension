import { useSignal } from '@preact/signals';
import { DocumentInfo, RequestMessage, TagName } from '../types/Execution';
import { useEffect } from 'preact/hooks';
import { useIndexedDB } from './IndexedDB';
import { storageName } from '../utils/GlobalUtils';
import { DbSchema } from '../utils/IndexedDBConfig';

const RequestPageDocument = async (tabId: number): Promise<DocumentInfo> => {
    if (tabId > 0) {
        const response = await chrome.tabs.sendMessage<
            RequestMessage,
            DocumentInfo
        >(tabId, {
            Command: 'GetDocumentInfo',
        });

        response.countHeader = function (tagName: TagName): number {
            return this.headerTree?.filter(
                (h) => h.tagName === TagName[tagName]
            ).length;
        };

        return response;
    }
    throw new Error('There is no active tab!');
};

const useInit = (tabInfo: chrome.tabs.Tab, updateSignal: number) => {
    const { getByID, add, update } = useIndexedDB(storageName);
    const IsProcessing = useSignal<boolean>(false);
    const docsInfo = useSignal<DocumentInfo | null>(null);
    const savedActiveTab = useSignal<string | null>(null);

    const UpdateActiveTab = async (tabKey: string) => {
        getByID<DbSchema>(tabInfo.id ?? -1).then(async (data) => {
            if (data) {
                update<DbSchema>({
                    ...data,
                    ActiveTab: tabKey,
                }).then(
                    (id) => {
                        console.log(`updated : ID ${id}`);
                    },
                    (error) => {
                        console.error(
                            `Failed to updated ${tabInfo.id} : ${error}`
                        );
                    }
                );
            }
        });
        savedActiveTab.value = tabKey;
    };

    const initData = (isUpdate: boolean) =>
        RequestPageDocument(tabInfo.id ?? -1).then(async (val) => {
            docsInfo.value = val;
            const { countHeader, ...schemaData } = val;
            if (isUpdate) {
                update<DbSchema>({
                    DocumentInfo: { ...schemaData },
                    Url: tabInfo.url ?? '',
                    TabId: tabInfo.id ?? -1,
                }).then(
                    (id) => {
                        console.log(`updated : ID ${id}`);
                    },
                    (error) => {
                        console.error(
                            `Failed to updated ${tabInfo.id} : ${error}`
                        );
                    }
                );
            } else {
                add<DbSchema>({
                    DocumentInfo: { ...schemaData },
                    Url: tabInfo.url ?? '',
                    TabId: tabInfo.id ?? -1,
                }).then(
                    (id) => {
                        console.log(`inserted : ID ${id}`);
                    },
                    (error) => {
                        console.error(
                            `Failed to inserted ${tabInfo.id} : ${error}`
                        );
                    }
                );
            }
        });

    const initFunc = () => {
        IsProcessing.value = true;
        savedActiveTab.value = null;
        try {
            getByID<DbSchema>(tabInfo.id ?? -1).then(async (data) => {
                if (!data) {
                    await initData(false);
                } else if (data.Url !== tabInfo.url) {
                    await initData(true);
                } else {
                    docsInfo.value = data.DocumentInfo;
                    docsInfo.value.countHeader = function (
                        tagName: TagName
                    ): number {
                        return this.headerTree?.filter(
                            (h) => h.tagName === TagName[tagName]
                        ).length;
                    };
                    savedActiveTab.value = data.ActiveTab ?? null;
                }
                IsProcessing.value = false;
            });
        } catch (Err) {
            IsProcessing.value = false;
            throw Err;
        }
    };

    useEffect(() => {
        initFunc();
    }, [tabInfo.id, tabInfo.url, updateSignal]);

    return { docsInfo, IsProcessing, UpdateActiveTab, savedActiveTab };
};

export default useInit;
