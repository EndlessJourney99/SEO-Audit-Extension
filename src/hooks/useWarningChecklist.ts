import { useContext, useEffect } from 'preact/hooks';
import * as Warning from '../utils/AuditChecklist/Warning';
import { useSignal } from '@preact/signals';
import { GlobalSignal } from '../signals/globalSignal';
import { AppState } from '../signals/globalContext';
import { RequestMessage } from '../types/Execution';
import { useIndexedDB } from './IndexedDB';
import { storageName } from '../utils/GlobalUtils';
import { DbSchema } from '../utils/IndexedDBConfig';

const ProcessWarningList = async (document: Document, currentUrl: URL) => {
    const userAgent = 'Googlebot';
    // DirectValue
    const pageWithoutDoctype = Warning.PageWithoutDoctype(document);
    const duplicateH1AndTitleContent =
        Warning.DuplicateH1AndTitleContent(document);
    const flashContentUsed = Warning.FlashContentUsed(document);
    const frameUsed = Warning.FrameUsed(document);
    const longTitleElement = Warning.LongTitleElement(document);
    const shortTitleElement = Warning.ShortTitleElement(document);
    const lowWordCount = Warning.LowWordCount(document);
    const lowTextToHtmlRatio = Warning.LowTextToHtmlRatio(document);
    const pageWithoutH1 = Warning.PageWithoutH1(document);
    const missingAltAttribute = Warning.MissingAltAttribute(document);
    const linkLeadToHttpPageOnHttpsSite = Warning.LinkLeadToHttpPageOnHttpsSite(
        document,
        currentUrl
    );
    const pageWithoutMetaDescription =
        Warning.PageWithoutMetaDescription(document);
    const missingHreflangAndLangAttribute =
        Warning.MissingHreflangAndLangAttribute(document);
    const noFollowAttributeInInternalLink =
        Warning.NoFollowAttributeInInternalLink(document, currentUrl);
    const tooManyJavascriptAndCssFiles =
        Warning.TooManyJavascriptAndCssFiles(document);
    const onPageLink = Warning.OnPageLink(document);
    const underscoreUrl = Warning.UnderscoreUrl(currentUrl);
    const tooManyParametersOnUrl = Warning.TooManyParametersOnUrl(currentUrl);

    // Promises
    const brokenExternalImgs = Warning.BrokenExternalImages(
        document,
        currentUrl
    );
    const brokenExternalLinks = Warning.BrokenExternalLinks(
        document,
        currentUrl
    );
    const encodingNotDeclare = Warning.EncodingNotDeclare(document, currentUrl);
    const BlockedInternalResourceInRobotsTxt =
        Warning.BlockedInternalResourceInRobotsTxt(
            document,
            currentUrl,
            userAgent
        );
    const TemporaryRedirect = Warning.TemporaryRedirect(currentUrl);
    const UncompressedPage = Warning.UncompressedPage(currentUrl);
    const uncompressedJsAndCssFile = Warning.UncompressedJsAndCssFile(
        document,
        currentUrl
    );

    const [
        brokenExternalImgsResult,
        brokenExternalLinksResult,
        encodingNotDeclareResult,
        BlockedInternalResourceInRobotsTxtResult,
        TemporaryRedirectResult,
        UncompressedPageResult,
        uncompressedJsAndCssFileResult,
    ] = await Promise.all(
        [
            brokenExternalImgs,
            brokenExternalLinks,
            encodingNotDeclare,
            BlockedInternalResourceInRobotsTxt,
            TemporaryRedirect,
            UncompressedPage,
            uncompressedJsAndCssFile,
        ].map((p) => p.catch((e) => null))
    );

    return {
        pageWithoutDoctype,
        duplicateH1AndTitleContent,
        flashContentUsed,
        frameUsed,
        longTitleElement,
        shortTitleElement,
        lowWordCount,
        lowTextToHtmlRatio,
        pageWithoutH1,
        missingAltAttribute,
        linkLeadToHttpPageOnHttpsSite,
        pageWithoutMetaDescription,
        missingHreflangAndLangAttribute,
        noFollowAttributeInInternalLink,
        tooManyJavascriptAndCssFiles,
        onPageLink,
        underscoreUrl,
        tooManyParametersOnUrl,
        brokenExternalImgs: brokenExternalImgsResult as string[] | null,
        brokenExternalLinks: brokenExternalLinksResult as string[] | null,
        encodingNotDeclare: encodingNotDeclareResult as boolean | null,
        BlockedInternalResourceInRobotsTxt:
            BlockedInternalResourceInRobotsTxtResult as boolean | null,
        TemporaryRedirect: TemporaryRedirectResult as boolean | null,
        UncompressedPage: UncompressedPageResult as boolean | null,
        uncompressedJsAndCssFile: uncompressedJsAndCssFileResult as
            | number
            | null,
    };
};

export type WarningListType = Awaited<ReturnType<typeof ProcessWarningList>>;

const useWarningCheckList = () => {
    const state: GlobalSignal = useContext(AppState);
    const { getByID, update } = useIndexedDB(storageName);
    const warningCheckList = useSignal({} as WarningListType);
    const isLoading = useSignal(false);

    const updateWarningList = async (val: WarningListType) => {
        getByID<DbSchema>(state.tabInfo.value.id ?? -1).then(async (data) => {
            if (data) {
                update<DbSchema>({
                    ...data,
                    WarningList: val,
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
            if (data && data.WarningList) {
                warningCheckList.value = data.WarningList;
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
                            ProcessWarningList(DOM, currentURL).then((val) => {
                                warningCheckList.value = val;
                                updateWarningList(val);
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
    return { warningCheckList, isLoading };
};

export default useWarningCheckList;
