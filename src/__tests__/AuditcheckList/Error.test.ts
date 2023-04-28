import { JSDOM } from 'jsdom';
import * as Error from '../../utils/AuditChecklist/Error';

import Acc from '../Resources/Acc';
import { hreflang_Invalid, hreflang_valid } from '../Resources/HrefLang';
import {
    Canonical_Multiple,
    Canonical_Single,
    Canonical_Empty,
} from '../Resources/Canonical_Issue';
import HreflangIssues from '../Resources/HrefLang_Link_Issues';
import MixedContent from '../Resources/MixedContent';

afterAll(() => {
    jest.resetAllMocks();
});

describe('BrokenCanonical', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest
            .fn()
            .mockImplementationOnce(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    const responseObj: Response = {
                        ...({} as Response),
                        status: 200,
                        ok: true,
                    };

                    return Promise.resolve<Response>(responseObj);
                }
            )
            .mockImplementationOnce(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    const responseObj: Response = {
                        ...({} as Response),
                        status: 404,
                        ok: false,
                    };

                    return Promise.resolve<Response>(responseObj);
                }
            );
    });

    test('case-1', async () => {
        const {
            window: { document },
        } = new JSDOM(Acc);

        const result = await Error.BrokenCanonical(document);
        expect(result).toBe(false);
    });

    test('case-2', async () => {
        const {
            window: { document },
        } = new JSDOM(Acc);

        const result = await Error.BrokenCanonical(document);
        expect(result).toBe(true);
    });
});

describe('BrokenInternalImage', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest
            .fn()
            .mockImplementation(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    if (
                        input
                            .toString()
                            .match(
                                /^https:\/\/acc.vn\/wp-content\/uploads\/.*$/g
                            )
                    )
                        return Promise.resolve<Response>({
                            ...({} as Response),
                            status: 404,
                            ok: false,
                            url: input.toString(),
                        });
                    else
                        return Promise.resolve<Response>({
                            ...({} as Response),
                            status: 200,
                            ok: true,
                            url: input.toString(),
                        });
                }
            );
    });

    it('must have 30 broken internal images', async () => {
        const {
            window: { document },
        } = new JSDOM(Acc);

        const currentUrl = new URL('https://acc.vn/gioi-thieu/ve-chung-toi/');
        const result = await Error.BrokenInternalImage(document, currentUrl);

        expect(result.length).toBe(30);
    });
});

describe('BrokenInternalLink', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest
            .fn()
            .mockImplementation(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    if (
                        input
                            .toString()
                            .match(/^https:\/\/acc.vn\/benh-dieu-tri\/.*$/g)
                    )
                        return Promise.resolve<Response>({
                            ...({} as Response),
                            status: 404,
                            ok: false,
                            url: input.toString(),
                        });
                    else
                        return Promise.resolve<Response>({
                            ...({} as Response),
                            status: 200,
                            ok: true,
                            url: input.toString(),
                        });
                }
            );
    });

    it('must have 30 broken internal links', async () => {
        const {
            window: { document },
        } = new JSDOM(Acc);

        const currentUrl = new URL('https://acc.vn/gioi-thieu/ve-chung-toi/');
        const result = await Error.BrokenInternalLinks(document, currentUrl);

        expect(result.length).toBe(30);
    });
});

describe('HrefLangValueIssue', () => {
    it('Have valid hreflang', () => {
        const {
            window: { document },
        } = new JSDOM(hreflang_valid);

        const result = Error.HrefLangValueIssue(document);
        expect(result).toBe(false);
    });

    it('Have Invalid hreflang', () => {
        const {
            window: { document },
        } = new JSDOM(hreflang_Invalid);

        const result = Error.HrefLangValueIssue(document);
        expect(result).toBe(true);
    });
});

describe('HreflangLinkIssue', () => {
    beforeAll(() => {
        jest.resetAllMocks();
        global.fetch = jest
            .fn()
            .mockImplementation(
                (input: RequestInfo | URL, init?: RequestInit | undefined) => {
                    if (
                        input
                            .toString()
                            .match(/https:\/\/acc.vn\/en-.*($|\/.*$)/g)
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

    it('Must have 3 error hreflang links', async () => {
        const {
            window: { document },
        } = new JSDOM(HreflangIssues);

        const result = await Error.IncorrectHreflangLink(document);

        expect(result).toBe(3);
    });
});

describe('MixedContent', () => {
    it('Must have 5 mixed content', () => {
        const {
            window: { document },
        } = new JSDOM(MixedContent);

        const result = Error.MixedContent(document);
        expect(result).toBe(5);
    });
});

describe('MultipleCanonicalUrl', () => {
    test('Single Canonical - With canonical Header', () => {
        const fakeResponse: Response = {
            ...({} as Response),
            status: 200,
            ok: true,
            headers: {
                ...({} as Headers),
                get: jest.fn((name: string): string | null => {
                    if (name.toLowerCase() === 'link')
                        return '<http://www.example.com/downloads/white-paper.pdf>; rel="canonical"';
                    return null;
                }),
            },
        };
        const {
            window: { document },
        } = new JSDOM(Canonical_Single);

        const result = Error.MultipleCanonicalUrl(document, fakeResponse);
        expect(result).toBe(true);
    });

    test('Single Canonical - With NO canonical Header', () => {
        const fakeResponse: Response = {
            ...({} as Response),
            status: 200,
            ok: true,
            headers: {
                ...({} as Headers),
                get: jest.fn((name: string): string | null => {
                    return null;
                }),
            },
        };
        const {
            window: { document },
        } = new JSDOM(Canonical_Single);

        const result = Error.MultipleCanonicalUrl(document, fakeResponse);
        expect(result).toBe(false);
    });

    test('No Canonical - With canonical Header', () => {
        const fakeResponse: Response = {
            ...({} as Response),
            status: 200,
            ok: true,
            headers: {
                ...({} as Headers),
                get: jest.fn((name: string): string | null => {
                    if (name.toLowerCase() === 'link')
                        return '<http://www.example.com/downloads/white-paper.pdf>; rel=""canonical"';
                    return null;
                }),
            },
        };
        const {
            window: { document },
        } = new JSDOM(Canonical_Empty);

        const result = Error.MultipleCanonicalUrl(document, fakeResponse);
        expect(result).toBe(false);
    });

    test('Multiple Canonical - With No canonical Header', () => {
        const fakeResponse: Response = {
            ...({} as Response),
            status: 200,
            ok: true,
            headers: {
                ...({} as Headers),
                get: jest.fn((name: string): string | null => {
                    return null;
                }),
            },
        };
        const {
            window: { document },
        } = new JSDOM(Canonical_Multiple);

        const result = Error.MultipleCanonicalUrl(document, fakeResponse);
        expect(result).toBe(true);
    });
});
