export type Commands =
    | 'GetDocumentInfo'
    | 'BotRender'
    | 'HighlightElement'
    | 'removeElementHighlight'
    | 'ScrollToElem'
    | 'CrawlHTML';
export type BackgroundCommands = 'ListenOnClose' | 'RunFetchInBG';

interface RequestMessage {
    Command: Commands;
    OptionParameters?: any;
    Data?: any;
}

interface BackgroundMessage {
    Command: BackgroundCommands;
    Data?: any;
    TabId?: number;
}

export enum TagName {
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
}

interface HTMLHeading {
    uniqueId: string;
    tagName: string;
    text: string | null;
    elementObj?: HTMLElement;
}

interface HTMLImage {
    src: string;
    alt: string;
    title: string;
    name: string;
}

interface HTMLAnchor {
    uniqueId: string;
    text: string | null;
    rel: string;
    href: string;
    representString: string;
    elementObj?: HTMLElement;
}

interface DocumentInfo {
    title?: string | null;
    description?: string | null;
    keywords?: string | null;
    url?: string | null;
    canonical?: string | null;
    robotTag?: string | null;
    htmlLang?: string | null;
    headerTree: HTMLHeading[];
    imageTags: HTMLImage[];
    anchorTags: HTMLAnchor[];
    countHeader?(tagName: TagName): number;
}

export type {
    RequestMessage,
    DocumentInfo,
    HTMLHeading,
    HTMLImage,
    HTMLAnchor,
    BackgroundMessage,
};
