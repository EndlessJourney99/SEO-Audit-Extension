import {
    DocumentInfo,
    HTMLAnchor,
    HTMLHeading,
    HTMLImage,
    RequestMessage,
} from './types/Execution';
import { CreateGuid } from './utils/GlobalUtils';

let headerTree: HTMLHeading[] = new Array<HTMLHeading>();
let Meta: Omit<DocumentInfo, 'imageTags' | 'headerTree' | 'anchorTags'>;
let imageTags: HTMLImage[];
let anchorTags: HTMLAnchor[];

chrome.runtime.onMessage.addListener(async function (
    message: RequestMessage,
    sender,
    sendResponse
) {
    switch (message.Command) {
        case 'GetDocumentInfo':
            Init(sendResponse);
            break;
        case 'HighlightElement':
            {
                let element = headerTree.find(
                    (e) => e.uniqueId === message.OptionParameters.elementId
                );
                if (element && element.elementObj) {
                    highlight(element.elementObj);
                }
            }
            break;
        case 'removeElementHighlight':
            {
                let element = headerTree.find(
                    (e) => e.uniqueId === message.OptionParameters.elementId
                );
                if (element && element.elementObj) {
                    removeHighlight(element.elementObj);
                }
            }
            break;
        case 'ScrollToElem':
            {
                const element = headerTree.find(
                    (e) => e.uniqueId === message.OptionParameters.elementId
                );
                if (element && element.elementObj)
                    scrollToElem(element.elementObj);
            }
            break;
        case 'CrawlHTML':
            sendResponse(CrawlCurrentHTML());
            break;
        default:
            break;
    }
});

function Init(sendResponse: (response: any) => void) {
    headerTree = getHeaderTree();
    Meta = snipAllMetaTags();
    imageTags = getAllImageTag();
    anchorTags = getAllAnchor();
    const responseObj: DocumentInfo = {
        ...Meta,
        headerTree: headerTree,
        imageTags: imageTags,
        anchorTags: anchorTags,
    };
    sendResponse(responseObj);
}

const snipAllMetaTags = (): Omit<
    DocumentInfo,
    'imageTags' | 'headerTree' | 'anchorTags'
> => {
    const title = document.querySelector('title')?.textContent;
    const description = document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content');
    const keywords = document
        .querySelector('meta[name="keywords"]')
        ?.getAttribute('content');
    const url = window.location.href;
    const canonical = document
        .querySelector('link[rel="canonical"]')
        ?.getAttribute('href');
    const robotTag = document
        .querySelector('meta[name="robots"]')
        ?.getAttribute('content');
    const htmlLang = document.documentElement.getAttribute('lang');

    return { title, description, keywords, url, canonical, robotTag, htmlLang };
};

function getHeaderTree(): HTMLHeading[] {
    const headers = Array.from(
        document.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6')
    );

    return headers.map<HTMLHeading>((item) => {
        return {
            uniqueId: CreateGuid(),
            tagName: item.tagName.toUpperCase(),
            text: item.textContent,
            elementObj: item,
        };
    });
}

const getAllImageTag = (): HTMLImage[] => {
    const ImageElements = Array.from(
        document.querySelectorAll<HTMLImageElement>('img')
    );

    return ImageElements.filter((i) => i.src.length).map<HTMLImage>((i) => {
        return { src: i.src, alt: i.alt, name: i.name, title: i.title };
    });
};

const getAllAnchor = (): HTMLAnchor[] => {
    const AnchorElements = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a')
    );

    return AnchorElements.filter(
        (a) => a.href.length && a.href !== 'javascript:;'
    ).map<HTMLAnchor>((a) => {
        return { href: a.href, text: a.textContent };
    });
};

function highlight(element: HTMLElement) {
    let isHighligh = element.getAttribute('is-highlight');
    if (isHighligh) return;
    let defaultBG = element.style.backgroundColor;
    let defaultTransition = element.style.transition;

    element.style.transition = 'background 0.3s';
    element.style.backgroundColor = '#a0c5e8b8';

    element.setAttribute('is-highlight', 'true');
    element.setAttribute('default-color', defaultBG);
    element.setAttribute('default-transition', defaultTransition);
}

function removeHighlight(element: HTMLElement) {
    let isHighligh = element.getAttribute('is-highlight');
    let defaultBG = element.getAttribute('default-color');
    let defaultTransition = element.getAttribute('default-transition');
    if (isHighligh && defaultBG != null && defaultTransition != null) {
        element.style.backgroundColor = defaultBG;
        element.style.transition = defaultTransition;

        element.removeAttribute('is-highlight');
        element.removeAttribute('default-color');
        element.removeAttribute('default-transition');
    }
}

function scrollToElem(element: HTMLElement) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
    });
}

function CrawlCurrentHTML() {
    const constructHTMLString = new XMLSerializer().serializeToString(document);
    return constructHTMLString;
}
// function resetPage(originalParams) {
//     window.scrollTo(0, originalParams.scrollTop);
//     document.querySelector('body')?.style.overflow = originalParams.overflow;
// }
