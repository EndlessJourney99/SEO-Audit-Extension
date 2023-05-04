import { convert } from 'html-to-text';

import robotsParser from '../CustomRobotParser';
import { GetRedirectionChain, IsLinkInternal } from './ChecklistUtils';
import { GetImageRealSrc, isValidUrl } from '../GlobalUtils';

// Unit test integrated
export const PageWithoutDoctype = (DOM: Document): boolean => {
    return DOM.doctype === null;
};

// Unit test integrated
export const BrokenExternalImages = async (
    DOM: Document,
    currentUrl: URL
): Promise<Array<string>> => {
    const allImgs = Array.from(DOM.querySelectorAll('img'));

    const allImgsSrc = allImgs.map((i) => GetImageRealSrc(i));

    const externalImgSrc = allImgsSrc.filter(
        (i) =>
            (i.length &&
                !i.startsWith('data:image/') &&
                IsLinkInternal(i, currentUrl)) ||
            IsLinkInternal(i, currentUrl)
    );

    let fetchedLink = new Array<string>();
    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < externalImgSrc.length; i++) {
        const url = externalImgSrc[i];

        if (url?.length && isValidUrl(url)) {
            if (!fetchedLink.includes(url))
                parallelTasks.push(
                    fetch(url, { redirect: 'follow', method: 'GET' })
                );
            fetchedLink.push(url);
        }
    }

    const responses = await Promise.all(
        parallelTasks.map((t) =>
            t.catch((e) => {
                console.log(e);
                return e;
            })
        )
    );
    const failedURL = responses
        .filter((r) => !(r instanceof Error) && !r.ok)
        .map((r) => r.url);
    return fetchedLink.filter((l) => failedURL.indexOf(l) > -1);
};

// Unit test integrated
export const BrokenExternalLinks = async (
    DOM: Document,
    currentUrl: URL
): Promise<Array<string>> => {
    const allLinks = Array.from(DOM.querySelectorAll('a')).filter(
        (i) =>
            i.getAttribute('href') &&
            i.getAttribute('href')?.length &&
            !i.getAttribute('href')?.startsWith('#') &&
            !i.getAttribute('href')?.startsWith('tel:')
    );
    const externalLinks = allLinks.filter((i) => {
        try {
            let UrlConstruct = new URL(i.getAttribute('href') ?? '');
            if (UrlConstruct.hostname === currentUrl.hostname) return false;
            return true;
        } catch {
            return false;
        }
    });

    let fetchedLink = new Array<string>();
    let parallelTasks = new Array<Promise<Response>>();
    for (let i = 0; i < externalLinks.length; i++) {
        const url = externalLinks[i].getAttribute('href');
        if (url?.length && isValidUrl(url) && !fetchedLink.includes(url)) {
            parallelTasks.push(
                fetch(url, { redirect: 'follow', method: 'GET' })
            );
            fetchedLink.push(url);
        }
    }
    const responses = await Promise.all(
        parallelTasks.map((t) =>
            t.catch((e) => {
                console.log(e);
                return e;
            })
        )
    );
    return responses
        .filter((r) => !(r instanceof Error) && !r.ok && r.status !== 429)
        .map((r) => r.url);
};

// Unit test integrated
export const DuplicateH1AndTitleContent = (DOM: Document): boolean => {
    const titleTag = DOM.querySelector('title')?.textContent;
    const H1Tags = Array.from(DOM.querySelectorAll('h1')).map(
        (i) => i.textContent
    );
    return H1Tags.filter((h) => h === titleTag).length > 0;
};

// Unit test integrated
export const EncodingNotDeclare = async (
    DOM: Document,
    currentUrl: URL
): Promise<boolean> => {
    const requestHeader = fetch(currentUrl, {
        redirect: 'follow',
        method: 'GET',
    });
    const metaEncoding = DOM.querySelector('meta[charset]');
    if (metaEncoding !== null && metaEncoding.getAttribute('charset')?.length)
        return false;

    const result = requestHeader
        .then((response) => {
            const headerVal = response.headers.get('content-type');
            if (headerVal && headerVal.indexOf('charset') !== -1) return false;
            return true;
        })
        .catch((err) => true);

    return await result;
};

// Unit test integrated
export const FlashContentUsed = (DOM: Document) => {
    const embeds = Array.from(DOM.querySelectorAll('embed'));
    const objects = Array.from(DOM.querySelectorAll('object'));

    for (let i = 0; i < embeds.length; i++) {
        if (
            embeds[i].getAttribute('type') ===
                'application/x-shockwave-flash' ||
            embeds[i].getAttribute('type') === 'application/x-oleobject'
        ) {
            return true;
        }
    }

    for (let i = 0; i < objects.length; i++) {
        const objectTag = objects[i];
        const paramTags = objectTag.querySelectorAll<HTMLElement>('param');
        let isFlash = false;

        for (let j = 0; j < paramTags?.length ?? 0; j++) {
            const paramTag = paramTags[j];
            if (
                paramTag &&
                paramTag.getAttribute('name')?.toLowerCase() === 'movie' &&
                paramTag.getAttribute('value')?.toLowerCase()?.includes('.swf')
            ) {
                isFlash = true;
                break;
            }
        }

        if (
            isFlash ||
            objectTag.getAttribute('type') ===
                'application/x-shockwave-flash' ||
            objectTag.getAttribute('type') === 'application/x-oleobject'
        ) {
            return true;
        }
    }

    return false;
};

// Unit test integrated
export const FrameUsed = (DOM: Document): boolean => {
    return (
        DOM.querySelector('frame') !== null ||
        DOM.querySelector('iframe') !== null
    );
};

// Unit test integrated
export const BlockedInternalResourceInRobotsTxt = async (
    DOM: Document,
    baseUrl: URL,
    userAgent: string
) => {
    const robots = robotsParser({
        userAgent: userAgent, // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
        allowOnNeutral: true, // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
    });

    await robots.useRobotsFor(baseUrl.origin);

    const internalImages = Array.from(DOM.querySelectorAll('img')).filter(
        (i) =>
            (i.getAttribute('src')?.length ||
                i.getAttribute('data-src')?.length) &&
            (i.getAttribute('src')?.indexOf(baseUrl.hostname) !== -1 ||
                (i.getAttribute('src')?.indexOf('http') === -1 &&
                    i.getAttribute('src')?.indexOf('www') === -1) ||
                (i.getAttribute('data-src')?.indexOf(baseUrl.hostname) ?? -1) >
                    -1 ||
                (i.getAttribute('data-src')?.indexOf('http') === -1 &&
                    i.getAttribute('data-src')?.indexOf('www') === -1))
    );

    const internalScript = Array.from(DOM.querySelectorAll('script')).filter(
        (s) =>
            s.getAttribute('src') !== null &&
            (s.getAttribute('src')?.includes(baseUrl.hostname) ||
                (s.getAttribute('src')?.indexOf('http') === -1 &&
                    s.getAttribute('src')?.indexOf('www') === -1))
    );
    const internalStyleSheet = Array.from(
        DOM.querySelectorAll('link[rel="stylesheet"]')
    ).filter(
        (s) =>
            s.getAttribute('href')?.length &&
            (s.getAttribute('href')?.includes(baseUrl.hostname) ||
                (s.getAttribute('href')?.indexOf('http') === -1 &&
                    s.getAttribute('href')?.indexOf('www') === -1))
    );

    for (let i = 0; i < internalImages.length; i++) {
        let link =
            internalImages[i].getAttribute('src') ??
            internalImages[i].getAttribute('data-src');

        if (!link) continue;
        let pathName: string = '';
        if (link && link.indexOf(baseUrl.hostname) === -1) pathName = link;
        else if (isValidUrl(link)) pathName = new URL(link).pathname;

        const result = robots.canCrawlSync(pathName);

        if (!result) return true;
    }

    for (let i = 0; i < internalScript.length; i++) {
        let link = internalScript[i].getAttribute('src');

        if (!link) continue;
        let pathName: string = '';
        if (link && link.indexOf(baseUrl.hostname) === -1) pathName = link;
        else pathName = new URL(link).pathname;

        const result = robots.canCrawlSync(pathName);

        if (!result) return true;
    }

    for (let i = 0; i < internalStyleSheet.length; i++) {
        let link = internalStyleSheet[i].getAttribute('href');

        if (!link) continue;
        let pathName: string = '';
        if (link && link.indexOf(baseUrl.hostname) === -1) pathName = link;
        else pathName = new URL(link).pathname;

        const result = robots.canCrawlSync(pathName);

        if (!result) return true;
    }

    return false;
};

export const LongTitleElement = (DOM: Document): boolean => {
    let titleText = DOM.querySelector('title')?.text;
    if (titleText && titleText.length > 70) return true;
    return false;
};

export const ShortTitleElement = (DOM: Document): boolean => {
    let titleText = DOM.querySelector('title')?.text;
    if (titleText === undefined || titleText.length <= 10) return true;
    return false;
};

// Unit test integrated
export const LowWordCount = (
    DOM: Document
): [isLow: boolean, wordsCount: number] => {
    const contentText = convert(DOM.body.outerHTML);
    let words: string[] = contentText?.split(/[\s,\n\r]+/gm) ?? [];
    words = words.filter((w) => w.length && w.match(/\w*$/g));
    return [words.length <= 300, words.length];
};

export const PageWithoutH1 = (DOM: Document): boolean => {
    return DOM.querySelector('h1') === null;
};

export const MissingAltAttribute = (DOM: Document): number => {
    const allImgs = Array.from(DOM.querySelectorAll('img'));

    return allImgs.filter(
        (i) =>
            i.role !== 'presentation' &&
            (i.alt === undefined || i.alt === null || i.alt.length === 0)
    ).length;
};

// Unit test integrated
export const LowTextToHtmlRatio = (
    DOM: Document
): [isLow: boolean, ratio: number] => {
    const htmlString = `<html>${DOM.documentElement.innerHTML}</html>`;
    const contentText = convert(DOM.body.outerHTML);
    const ratio = Math.ceil((contentText.length / htmlString.length) * 100);

    return [ratio < 10.0, ratio];
};

// Unit test integrated
export const LinkLeadToHttpPageOnHttpsSite = (
    DOM: Document,
    currentUrl: URL
): string[] => {
    if (currentUrl.protocol === 'http:') return [];
    const baseTag = DOM.querySelector('base');
    const anchorTags = DOM.querySelectorAll('a');

    let baseTagHttp = false;
    const lstHttpLinks: string[] = new Array<string>();
    if (baseTag && baseTag.href.includes('http://')) baseTagHttp = true;

    for (let i = 0; i < anchorTags.length; i++) {
        const link = anchorTags[i].href;
        if (link.length && link.indexOf('http:') > -1) {
            lstHttpLinks.push(link);
        } else if (
            link.length &&
            (link.indexOf('http') === -1 || link.indexOf('www') === -1) &&
            baseTagHttp
        )
            lstHttpLinks.push(link);
    }

    return lstHttpLinks;
};

export const PageWithoutMetaDescription = (DOM: Document) => {
    const metaDesc = DOM.querySelector(
        "meta[name='description']"
    )?.getAttribute('content');
    if (metaDesc?.length) return false;
    return true;
};

export const MissingHreflangAndLangAttribute = (DOM: Document) => {
    const hreflangTags = Array.from(
        DOM.querySelectorAll("link[rel='alternate'][hreflang]")
    );
    const htmlLangAttr = DOM.documentElement.lang ?? '';
    return hreflangTags.length === 0 && htmlLangAttr.length === 0;
};

export const NoFollowAttributeInInternalLink = (
    DOM: Document,
    currentUrl: URL
): number => {
    const allInternalLinks = Array.from(
        DOM.querySelectorAll<HTMLAnchorElement>('a[href]')
    ).filter((i) => {
        try {
            if (
                i.href?.startsWith('#') ||
                i.href?.startsWith('tel:') ||
                i.href?.startsWith('mailto:')
            )
                return false;
            let UrlConstruct = new URL(i.href ?? '');
            if (UrlConstruct.hostname === currentUrl.hostname) return true;
            return false;
        } catch {
            return true;
        }
    });

    return allInternalLinks.filter((i) => i.rel === 'nofollow').length;
};

// Chỉ có thể chạy trên chrome => không thể viết unit test
export const TemporaryRedirect = async (currentUrl: URL) => {
    let redirectionChain: Array<{ redirectUrl: string; status: number }> =
        await GetRedirectionChain(currentUrl);
    for (let i = 0; i < redirectionChain.length; i++) {
        if (
            redirectionChain[i].status === 307 ||
            redirectionChain[i].status === 302
        )
            return true;
    }
    return false;
};

// export const TooLargeJsAndCssTotalSize = async (DOM: Document) => {
//     const allScriptFiles = Array.from(
//         DOM.querySelectorAll('script')
//     ).filter((s) => s.src.length || s.getAttribute('data-src')?.length);
//     const allStylesheets = Array.from(
//         DOM.querySelectorAll("link[rel='stylesheet'][href]")
//     );

//     for (let i = 0; i < allScriptFiles.length; i++) {
//         const response  = await fetch(allScriptFiles[i].src);
//         response.
//     }
// };

export const TooManyJavascriptAndCssFiles = (DOM: Document) => {
    const allScriptFiles = Array.from(DOM.querySelectorAll('script')).filter(
        (s) => s.src.length || s.getAttribute('data-src')?.length
    );
    const allStylesheets = Array.from(
        DOM.querySelectorAll("link[rel='stylesheet'][href]")
    );

    return (allScriptFiles?.length ?? 0 + allStylesheets?.length ?? 0) >= 100;
};

export const OnPageLink = (DOM: Document) => {
    const allLinks = Array.from(DOM.querySelectorAll('a[href]'));
    return allLinks.length;
};

// Unit test integrated
export const UncompressedPage = async (currentUrl: URL) => {
    const response = await fetch(currentUrl);
    const encoding = response.headers.get('Content-Encoding');
    if (
        encoding &&
        (encoding.toLowerCase() == 'br' ||
            encoding.toLowerCase() == 'gzip' ||
            encoding.toLowerCase() == 'deflate')
    )
        return false;
    return true;
};

export const UnderscoreUrl = (currentUrl: URL) => {
    return currentUrl.href.includes('_');
};

// Unit test integrated
export const TooManyParametersOnUrl = (currentUrl: URL) => {
    const searchParams = Array.from(currentUrl.searchParams);
    return searchParams.length > 4;
};

// Unit test integrated
export const UncompressedJsAndCssFile = async (
    DOM: Document,
    currentUrl: URL
) => {
    const allScriptFiles = Array.from(DOM.querySelectorAll('script')).filter(
        (s) => s.src.length || s.getAttribute('data-src')?.length
    );
    const allStylesheets = Array.from(
        DOM.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet'][href]")
    );

    let parallelTasks = new Array<Promise<Response>>();

    for (let i = 0; i < allScriptFiles.length; i++) {
        let link =
            allScriptFiles[i].src ?? allScriptFiles[i].getAttribute('data-src');
        if (link.includes('chrome-extension://')) continue;
        if (!link.includes('http') && !link.includes('www'))
            link = `${currentUrl.protocol}//${currentUrl.hostname}/${
                link.startsWith('/') ? link.substring(1) : link
            }`;
        if (isValidUrl(link)) parallelTasks.push(fetch(link));
    }
    for (let i = 0; i < allStylesheets.length; i++) {
        let link = allStylesheets[i].href ?? '';
        if (!link.includes('http') && !link.includes('www'))
            link = `${currentUrl.protocol}//${currentUrl.hostname}/${
                link.startsWith('/') ? link.substring(1) : link
            }`;
        if (isValidUrl(link)) parallelTasks.push(fetch(link));
    }

    const responses = await Promise.all(
        parallelTasks.map((t) => t.catch((e) => e))
    );
    const uncompressedFiles = responses.filter((r) => {
        if (r instanceof Error || !r.ok) return false;
        const encoding = r.headers.get('Content-Encoding');
        if (
            encoding &&
            (encoding.toLowerCase() == 'br' ||
                encoding.toLowerCase() == 'gzip' ||
                encoding.toLowerCase() == 'deflate')
        )
            return false;
        return true;
    });

    return uncompressedFiles.length;
};
