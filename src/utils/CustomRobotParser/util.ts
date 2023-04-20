const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;

// Windows paths like `c:\`
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;

function isAbsoluteUrl(url) {
    if (typeof url !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof url}\``);
    }

    if (WINDOWS_PATH_REGEX.test(url)) {
        return false;
    }

    return ABSOLUTE_URL_REGEX.test(url);
}

const hasHttpProtocol = (protocol) =>
    protocol === 'http:' || protocol === 'https:';

const addProtocol = (link) => `http://${link}`;

const isFunction = (value) => typeof value === 'function';

const formatLink = (rawLink) => {
    let link = rawLink;
    // No protocol on the link, this can screw up url parsing with node url
    // so add a protocol and then parse.
    if (!isAbsoluteUrl(link)) {
        link = addProtocol(link);
    }
    const parsedLink = new URL(link);

    // The protocol the link has is non-http, therefore we give it a http based protocol.
    if (!hasHttpProtocol(parsedLink.protocol)) {
        parsedLink.protocol = 'http:';
    }
    // Return the base link.
    return `${parsedLink.protocol}//${parsedLink.hostname}`;
};

/*
 * Calculates the number of records that apply for the
 * given path and the maximum specificity of all
 * the records which apply.
 */
const applyRecords = (path, records) => {
    let numApply = 0;
    let maxSpecificity = 0;

    for (let i = 0; i < records.length; i += 1) {
        const record = records[i];
        if (record.path.test(path)) {
            numApply += 1;
            if (record.specificity > maxSpecificity) {
                maxSpecificity = record.specificity;
            }
        }
    }

    return {
        numApply,
        maxSpecificity,
    };
};

export { hasHttpProtocol, addProtocol, formatLink, applyRecords, isFunction };
