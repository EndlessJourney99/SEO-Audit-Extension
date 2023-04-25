import { BackgroundMessage } from '../../types/Execution';
import {
    ISO_3166_1_Alpha2_Country,
    ISO_639_1_Language,
    IsLinkInternal,
} from './ChecklistUtils';

// TESTED
export const BrokenCanonical = async (document: Document) => {
    const canonicalUrl = document.querySelector<HTMLLinkElement>(
        "link[rel='canonical']"
    )?.href;
    try {
        if (canonicalUrl) {
            const response = await fetch(canonicalUrl);
            if (response.ok) return false;
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

// TESTED
export const MultipleCanonicalUrl = (
    document: Document,
    fetchResponse: Response
) => {
    const canonicalTags = Array.from(
        document.querySelectorAll("link[rel='canonical']")
    );
    if (canonicalTags.length >= 2) return true;

    if (canonicalTags.length > 0) {
        const headerCanonical = fetchResponse.headers.get('link');
        if (headerCanonical && headerCanonical.includes('canonical'))
            return true;
    }
    return false;
};

export const NonSecurePage = (fetchResponse: Response) => {
    if (fetchResponse.ok && fetchResponse.url.includes('https:')) return false;
    return true;
};

export const MissConfiguredViewPort = (document: Document) => {
    const viewPortTag = document.querySelector("meta[name='viewport']");
    if (viewPortTag) {
        const contentViewPort = viewPortTag.getAttribute('content');
        if (
            contentViewPort &&
            contentViewPort.includes('width=') &&
            contentViewPort.includes('initial-scale=')
        )
            return false;
        return true;
    }
    return true;
};

export const BrokenInternalJsAndCss = async (
    document: Document,
    currentUrl: URL
) => {
    const allScriptFiles = Array.from(
        document.querySelectorAll('script')
    ).filter((s) => s.src.length || s.getAttribute('data-src')?.length);
    const allStylesheets = Array.from(
        document.querySelectorAll<HTMLLinkElement>(
            "link[rel='stylesheet'][href]"
        )
    );

    const internalScripts = allScriptFiles.filter(
        (s) =>
            (s.src && IsLinkInternal(s.src, currentUrl)) ||
            (s.getAttribute('data-src') &&
                IsLinkInternal(s.getAttribute('data-src') ?? '', currentUrl))
    );
    const internalStylesheets = allStylesheets.filter(
        (s) => s.href && IsLinkInternal(s.href, currentUrl)
    );

    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < internalScripts.length; i++) {
        let link =
            internalScripts[i].src ??
            internalScripts[i].getAttribute('data-src');
        if (!link.includes('http') && !link.includes('www'))
            link = `${currentUrl.protocol}//${currentUrl.hostname}/${
                link.startsWith('/') ? link.substring(1) : link
            }`;
        parallelTasks.push(fetch(link));
    }
    for (let i = 0; i < internalStylesheets.length; i++) {
        let link = internalStylesheets[i].href ?? '';
        if (!link.includes('http') && !link.includes('www'))
            link = `${currentUrl.protocol}//${currentUrl.hostname}/${
                link.startsWith('/') ? link.substring(1) : link
            }`;
        parallelTasks.push(fetch(link));
    }

    const responses = await Promise.all(
        parallelTasks.map((t) => t.catch((e) => e))
    );
    return responses.filter((r) => !(r instanceof Error) && !r.ok).length;
};

// TESTED
export const BrokenInternalImage = async (
    document: Document,
    currentUrl: URL
) => {
    const allImgs = Array.from(document.querySelectorAll('img')).filter(
        (i) => i.src.length || i.getAttribute('data-src')?.length
    );

    const internalImg = allImgs.filter(
        (i) =>
            (i.src && IsLinkInternal(i.src, currentUrl)) ||
            (i.getAttribute('data-src') &&
                IsLinkInternal(i.getAttribute('data-src') ?? '', currentUrl))
    );

    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < internalImg.length; i++) {
        let link =
            internalImg[i].src ?? internalImg[i].getAttribute('data-src');
        if (link && !link.includes('http') && !link.includes('www'))
            link = `${currentUrl.protocol}//${currentUrl.hostname}/${
                link.startsWith('/') ? link.substring(1) : link
            }`;
        if (link?.length)
            parallelTasks.push(
                fetch(link, { redirect: 'follow', method: 'HEAD' })
            );
    }

    const responses = await Promise.all(
        parallelTasks.map((t) => t.catch((e) => e))
    );
    return responses
        .filter((r) => !(r instanceof Error) && !r.ok)
        .map((r) => r.url);
};

// TESTED
export const BrokenInternalLinks = async (
    document: Document,
    currentUrl: URL
): Promise<Array<string>> => {
    const allLinks = Array.from(document.querySelectorAll('a')).filter(
        (i) =>
            i.href?.length &&
            !i.href?.startsWith('#') &&
            !i.href?.startsWith('tel:')
    );
    const internalLinks = allLinks.filter(
        (i) => i.href && IsLinkInternal(i.href, currentUrl)
    );

    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < internalLinks.length; i++) {
        let url = internalLinks[i].getAttribute('href');
        if (url && !url.includes('http') && !url.includes('www'))
            url = `${currentUrl.protocol}//${currentUrl.hostname}/${
                url.startsWith('/') ? url.substring(1) : url
            }`;
        if (url?.length)
            parallelTasks.push(
                fetch(url, { redirect: 'follow', method: 'GET' })
            );
    }

    const responses = await Promise.all(
        parallelTasks.map((t) => t.catch((e) => e))
    );
    return responses
        .filter((r) => !(r instanceof Error) && !r.ok)
        .map((r) => r.url);
};

// TESTED
export const HrefLangValueIssue = (document: Document) => {
    const hreflangTags = Array.from(
        document.querySelectorAll("link[rel='alternate'][hreflang]")
    );
    for (let i = 0; i < hreflangTags.length; i++) {
        const hreflangVal = hreflangTags[i].getAttribute('hreflang');
        if (hreflangVal && hreflangVal.length > 0) {
            const hreflangPart = hreflangVal.split('-');
            const langCode = hreflangPart[0];
            if (!ISO_639_1_Language.includes(langCode)) return true;
            if (
                hreflangPart.length > 1 &&
                ISO_3166_1_Alpha2_Country.findIndex(
                    (i) => i.toUpperCase() === hreflangPart[1].toUpperCase()
                ) === -1
            )
                return true;
        } else return true;
    }

    return false;
};

// TESTED
export const IncorrectHreflangLink = async (document: Document) => {
    const hreflangTags = Array.from(
        document.querySelectorAll("link[rel='alternate'][hreflang]")
    );

    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < hreflangTags.length; i++) {
        const link = hreflangTags[i].getAttribute('href');
        if (link && link.length > 1) parallelTasks.push(fetch(link));
    }

    const responses = await Promise.all(
        parallelTasks.map((t) => t.catch((e) => e))
    );
    return responses.filter((r) => !(r instanceof Error) && !r.ok).length;
};

// TESTED
export const MixedContent = (document: Document) => {
    const mixedLinkMeta = Array.from(
        document.querySelectorAll<HTMLLinkElement>(
            'link:not([rel="stylesheet"])'
        )
    ).filter((l) => l.href.includes('http://'));
    const mixedAnchor = Array.from(document.querySelectorAll('a')).filter((a) =>
        a.href.includes('http://')
    );
    const mixedJs = Array.from(document.querySelectorAll('script')).filter(
        (s) =>
            s.src?.includes('http://') ||
            s.getAttribute('data-src')?.includes('http://')
    );
    const mixedCss = Array.from(
        document.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']")
    ).filter((l) => l.href.includes('http://'));
    const mixedImgs = Array.from(document.querySelectorAll('img')).filter(
        (i) =>
            i.src?.includes('http://') ||
            i.getAttribute('data-src')?.includes('http://')
    );
    const mixedIframe = Array.from(document.querySelectorAll('iframe')).filter(
        (i) =>
            i.src?.includes('http://') ||
            i.getAttribute('data-src')?.includes('http://')
    );

    return (
        mixedLinkMeta.length +
        mixedAnchor.length +
        mixedJs.length +
        mixedCss.length +
        mixedImgs.length +
        mixedIframe.length
    );
};

export const MissingTitleTag = (document: Document) => {
    const titleTag = document.querySelector('title');
    if (titleTag == null || !titleTag.textContent?.length) return true;
    return false;
};
