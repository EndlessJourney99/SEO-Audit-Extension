import { useContext, useEffect } from 'preact/hooks';
import * as Error from '../utils/AuditChecklist/Error';
import { useSignal } from '@preact/signals';
import { GlobalSignal } from '../signals/globalSignal';
import { AppState } from '../signals/globalContext';
import { RequestMessage } from '../types/Execution';
import { useIndexedDB } from './IndexedDB';
import { storageName } from '../utils/GlobalUtils';
import { DbSchema } from '../utils/IndexedDBConfig';

const ProcessErrorList = async (document: Document, currentUrl: URL) => {
    const fetchResponse = await fetch(currentUrl);
    // DirectValue
    const multipleCanonicalUrl = Error.MultipleCanonicalUrl(
        document,
        fetchResponse
    );
    const nonSecurePage = Error.NonSecurePage(fetchResponse);
    const missConfiguredViewPort = Error.MissConfiguredViewPort(document);
    const hrefLangValueIssue = Error.HrefLangValueIssue(document);
    const mixedContent = Error.MixedContent(document);
    const missingTitleTag = Error.MissingTitleTag(document);

    // Promise
    const brokenCanonical = Error.BrokenCanonical(document);
    const brokenInternalJsAndCss = Error.BrokenInternalJsAndCss(
        document,
        currentUrl
    );
    const brokenInternalImage = Error.BrokenInternalImage(document, currentUrl);
    const brokenInternalLinks = Error.BrokenInternalLinks(document, currentUrl);
    const IncorrectHreflangLink = Error.IncorrectHreflangLink(document);

    const [
        brokenCanonicalResult,
        brokenInternalJsAndCssResult,
        brokenInternalImageResult,
        brokenInternalLinksResult,
        IncorrectHreflangLinkResult,
    ] = await Promise.all(
        [
            brokenCanonical,
            brokenInternalJsAndCss,
            brokenInternalImage,
            brokenInternalLinks,
            IncorrectHreflangLink,
        ].map((p) => p.catch((e) => null))
    );

    return {
        multipleCanonicalUrl,
        nonSecurePage,
        missConfiguredViewPort,
        hrefLangValueIssue,
        mixedContent,
        missingTitleTag,
        brokenCanonical: brokenCanonicalResult as boolean | null,
        brokenInternalJsAndCss: brokenInternalJsAndCssResult as number | null,
        brokenInternalImage: brokenInternalImageResult as string[] | null,
        brokenInternalLinks: brokenInternalLinksResult as string[] | null,
        IncorrectHreflangLink: IncorrectHreflangLinkResult as number | null,
    };
};
export type ErrorListType = Awaited<ReturnType<typeof ProcessErrorList>>;

const useErrorChecklist = () => {
    const state: GlobalSignal = useContext(AppState);
    const { getByID, update } = useIndexedDB(storageName);
    const errorCheckList = useSignal({} as ErrorListType);
    const isLoading = useSignal(false);

    const updateErrorList = async (val: ErrorListType) => {
        getByID<DbSchema>(state.tabInfo.value.id ?? -1).then(async (data) => {
            if (data) {
                update<DbSchema>({
                    ...data,
                    ErrorList: val,
                }).then(
                    (id) => {
                        console.log(`updated : ID ${id}`);
                    },
                    (error) => {
                        console.error(`Failed to updated : ${error}`);
                    }
                );
            }
        });
    };

    useEffect(() => {
        isLoading.value = true;
        getByID<DbSchema>(state.tabInfo.value.id ?? -1).then((data) => {
            if (data && data.ErrorList) {
                errorCheckList.value = data.ErrorList;
                isLoading.value = false;
            } else {
                chrome.tabs.sendMessage<RequestMessage>(
                    state.tabInfo.value.id ?? -1,
                    { Command: 'CrawlHTML' },
                    (response: string) => {
                        const parser = new DOMParser();
                        const currentURL = new URL(
                            state.tabInfo.value.url ?? 'javascript:(0)'
                        );

                        let DOM = parser.parseFromString(response, 'text/html');
                        const baseTagElem = DOM.createElement('base');
                        baseTagElem.href = `${currentURL.protocol}//${currentURL.hostname}`;
                        DOM.head.appendChild(baseTagElem);

                        if (DOM) {
                            ProcessErrorList(DOM, currentURL).then((val) => {
                                errorCheckList.value = val;
                                updateErrorList(val);
                                isLoading.value = false;
                            });
                        }
                    }
                );
            }
        });
    }, [
        state.tabInfo.value.id,
        state.tabInfo.value.url,
        state.updateSignal.value,
    ]);
    return { errorCheckList, isLoading };
};

export default useErrorChecklist;
