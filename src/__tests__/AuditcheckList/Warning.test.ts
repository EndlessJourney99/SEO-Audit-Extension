import * as Warning from '../../utils/AuditChecklist/Warning';
import { JSDOM } from 'jsdom';
const simpleGet = require('simple-get');

import BlockInternalResources from '../Resources/Warning/BlockInternalResources';
import Doctype_Valid from '../Resources/Warning/Doctype_Valid';
import Doctype_InValid from '../Resources/Warning/Doctype_InValid';
import BrokenExternalResource from '../Resources/Warning/BrokenExternalResources';
import {
    Empty,
    DuplicateH1AndTitle_Invalid,
    DuplicateH1AndTitle_Valid,
} from '../Resources/Warning/DuplicateH1AndTitle';
import {
    FlashAndFrame_NotUsed,
    FlashAndFrame_Used,
} from '../Resources/Warning/Flash_Frame_Content';
import WordCount from '../Resources/Warning/WordCount';

afterAll(() => {
    jest.resetAllMocks();
});

describe('BlockedInternalResourceInRobotsTxt', () => {
    it('Robot_case1', async () => {
        simpleGet.concat = jest.fn((opts, cb) => {
            let result = `User-agent: *
                Allow: /
                Disallow: /resources/
                Sitemap: https://example.com/sitemap.xml`;
            cb(null, result, result);
            return result;
        });
        // expect(jest.isMockFunction(simpleGet.concat)).toBe(true);
        const {
            window: { document },
        } = new JSDOM(BlockInternalResources);
        const baseUrl = new URL('https://example.com');
        const userAgent = 'Googlebot';

        const result = await Warning.BlockedInternalResourceInRobotsTxt(
            document,
            baseUrl,
            userAgent
        );
        expect(result).toBe(true);
    });

    it('Robot_case2', async () => {
        simpleGet.concat = jest.fn((opts, cb) => {
            let result = `
                User-agent: *
                Allow: /
                Disallow: /admin

                User-agent: GoogleBot
                Disallow: /resources
                Disallow: /Admin
                Allow: /
            `;
            cb(null, result, result);
            return result;
        });
        const {
            window: { document },
        } = new JSDOM(BlockInternalResources);
        const baseUrl = new URL('https://example.com');
        const userAgent = 'Googlebot';

        const result = await Warning.BlockedInternalResourceInRobotsTxt(
            document,
            baseUrl,
            userAgent
        );
        expect(result).toBe(true);
    });

    it('Robot_case3', async () => {
        simpleGet.concat = jest.fn((opts, cb) => {
            let result = `
                User-agent: *
                Allow: /
                Disallow: /admin
                Sitemap: https://example.com/abc/what_is_this.xml
            `;
            cb(null, result, result);
            return result;
        });
        const {
            window: { document },
        } = new JSDOM(BlockInternalResources);
        const baseUrl = new URL('https://example.com');
        const userAgent = 'Googlebot';

        const result = await Warning.BlockedInternalResourceInRobotsTxt(
            document,
            baseUrl,
            userAgent
        );
        expect(result).toBe(false);
    });
});

describe('PageWithoutDoctype', () => {
    it('Is_Valid', () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_Valid);

        expect(Warning.PageWithoutDoctype(document)).toBe(false);
    });

    it('Is_In_Valid', () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_InValid);

        expect(Warning.PageWithoutDoctype(document)).toBe(true);
    });
});

describe('BrokenExternalImages', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn(
            (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                if (
                    input
                        .toString()
                        .match(/https:\/\/external.com\/image\/broken\/*/m)
                )
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 404,
                        ok: false,
                    });
                else if (
                    input.toString().match(/https:\/\/example.com\/image\/*/m)
                )
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 404,
                        ok: false,
                    });
                else
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 200,
                        ok: true,
                    });
            }
        );
    });

    it('Must have 3 broken images', async () => {
        const {
            window: { document },
        } = new JSDOM(BrokenExternalResource);
        const currentUrl = new URL('https://example.com');
        const result = await Warning.BrokenExternalImages(document, currentUrl);

        expect(result.length).toBe(3);
    });
});

describe('BrokenExternalLinks', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn(
            (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                if (
                    input
                        .toString()
                        .match(/https:\/\/external.com\/invalid\/*/m)
                )
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 404,
                        ok: false,
                    });
                else if (input.toString().match(/https:\/\/example.com\/*/m))
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 404,
                        ok: false,
                    });
                else
                    return Promise.resolve<Response>({
                        ...({} as Response),
                        status: 200,
                        ok: true,
                    });
            }
        );
    });

    it('Must have 2 broken link', async () => {
        const {
            window: { document },
        } = new JSDOM(BrokenExternalResource);
        const currentUrl = new URL('https://example.com');
        const result = await Warning.BrokenExternalLinks(document, currentUrl);

        expect(result.length).toBe(2);
    });
});

describe('DuplicateH1AndTitleContent', () => {
    it('Invalid', async () => {
        const {
            window: { document },
        } = new JSDOM(DuplicateH1AndTitle_Valid);
        const result = await Warning.DuplicateH1AndTitleContent(document);
        expect(result).toBe(false);
    });

    it('InValid', async () => {
        const {
            window: { document },
        } = new JSDOM(DuplicateH1AndTitle_Invalid);
        const result = await Warning.DuplicateH1AndTitleContent(document);
        expect(result).toBe(true);
    });

    it('Empty', async () => {
        const {
            window: { document },
        } = new JSDOM(Empty);
        const result = await Warning.DuplicateH1AndTitleContent(document);
        expect(result).toBe(false);
    });
});

describe('EncodingNotDeclare', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest
            .fn()
            .mockImplementation(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    if (input.toString().match(/^.*\/header-valid\/*$/m)) {
                        const responseObj: Response = {
                            ...({} as Response),
                            status: 200,
                            ok: true,
                            headers: {
                                ...({} as Headers),
                                get: jest.fn((name: string): string | null => {
                                    if (name.toLowerCase() === 'content-type')
                                        return 'text/html; charset=utf-8';
                                    return null;
                                }),
                            },
                        };

                        return Promise.resolve<Response>(responseObj);
                    } else {
                        const responseObj: Response = {
                            ...({} as Response),
                            status: 200,
                            ok: true,
                            headers: {
                                ...({} as Headers),
                                get: jest.fn((name: string): string | null => {
                                    if (name.toLowerCase() === 'content-type')
                                        return 'application/json';
                                    return null;
                                }),
                            },
                        };

                        return Promise.resolve<Response>(responseObj);
                    }
                }
            );
    });

    test('header no content-type | Document have content-type', async () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_Valid);
        const currentUrl = new URL('https://example.com');
        const result = await Warning.EncodingNotDeclare(document, currentUrl);

        expect(result).toBe(false);
    });

    test('header have content-type | Document have content-type', async () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_Valid);
        const currentUrl = new URL('https://example.com/header-valid');
        const result = await Warning.EncodingNotDeclare(document, currentUrl);

        expect(result).toBe(false);
    });

    test('header have content-type | Document not have content-type', async () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_InValid);
        const currentUrl = new URL('https://example.com/header-valid');
        const result = await Warning.EncodingNotDeclare(document, currentUrl);

        expect(result).toBe(false);
    });

    test('header not have content-type | Document not have content-type', async () => {
        const {
            window: { document },
        } = new JSDOM(Doctype_InValid);
        const currentUrl = new URL('https://example.com');
        const result = await Warning.EncodingNotDeclare(document, currentUrl);

        expect(result).toBe(true);
    });
});

describe('FlashContentUsed', () => {
    it('Used', async () => {
        const {
            window: { document },
        } = new JSDOM(FlashAndFrame_Used);
        const result = await Warning.FlashContentUsed(document);
        expect(result).toBe(true);
    });

    it('Not_Used', async () => {
        const {
            window: { document },
        } = new JSDOM(FlashAndFrame_NotUsed);
        const result = await Warning.FlashContentUsed(document);
        expect(result).toBe(false);
    });
});
describe('FrameContentUsed', () => {
    it('Used', async () => {
        const {
            window: { document },
        } = new JSDOM(FlashAndFrame_Used);
        const result = await Warning.FrameUsed(document);
        expect(result).toBe(true);
    });

    it('Not_Used', async () => {
        const {
            window: { document },
        } = new JSDOM(FlashAndFrame_NotUsed);
        const result = await Warning.FrameUsed(document);
        expect(result).toBe(false);
    });
});

describe('WordAndHtmlRatio', () => {
    it('must in range 4000 to 5500', () => {
        const {
            window: { document },
        } = new JSDOM(WordCount);

        const result: [isLow: boolean, wordsCount: number] =
            Warning.LowWordCount(document);
        expect(result[1]).toBeGreaterThanOrEqual(4000);
        expect(result[1]).toBeLessThanOrEqual(5500);
    });

    it('low text ratio', () => {
        const {
            window: { document },
        } = new JSDOM(WordCount);

        const result: [isLow: boolean, ratio: number] =
            Warning.LowTextToHtmlRatio(document);

        expect(result[1]).toBeGreaterThanOrEqual(20);
        expect(result[1]).toBeLessThanOrEqual(30);
    });
});

