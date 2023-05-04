import useWarningCheckList from '../../hooks/useWarningChecklist';

const WarningChecklist = () => {
    const { warningCheckList, isLoading } = useWarningCheckList();

    const constructIssueTable = (checkList: typeof warningCheckList.value) => {
        let rows = new Array<JSX.Element>();
        let index = 1;

        if (checkList.pageWithoutDoctype) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page Without Doctype</td>
                    <td>HTML does not contains doctype</td>
                </tr>
            );
            index++;
        }
        if (checkList.duplicateH1AndTitleContent) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Duplicate H1 And Title Content</td>
                    <td>Title tag and H1 have the same content</td>
                </tr>
            );
            index++;
        }
        if (checkList.flashContentUsed) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Flash Content Used</td>
                    <td>
                        Flash content is an old and deprecated technology. Using
                        this will open potential for vulnerability for your
                        website
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.frameUsed) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>IFrame Content Used</td>
                    <td></td>
                </tr>
            );
            index++;
        }
        if (checkList.longTitleElement) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Long title</td>
                    <td>
                        Title with more than 70 characters will be considered as
                        a long title.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.shortTitleElement) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Short title</td>
                    <td>
                        Title with length less than 10 characters will be
                        considered as a short title.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.lowWordCount && checkList.lowWordCount[0]) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>
                        Low word count{' '}
                        <span className="font-bold italic">
                            ({checkList.lowWordCount[1]} words)
                        </span>
                    </td>
                    <td>
                        Content for this page is too thin (or low). Aiming
                        content for at least 300 words.
                    </td>
                </tr>
            );
            index++;
        }
        // if (checkList.lowTextToHtmlRatio && checkList.lowTextToHtmlRatio[0]) {
        //     rows.push(
        //         <tr>
        //             <td>{index}</td>
        //             <td>
        //                 Low text-HTML ratio{' '}
        //                 <span className="font-bold italic">
        //                     ({checkList.lowTextToHtmlRatio[1]} percent)
        //                 </span>
        //             </td>
        //             <td>
        //                 This mean your text content is too low compare to the
        //                 size of HTML that made up the whole page.
        //             </td>
        //         </tr>
        //     );
        //     index++;
        // }
        if (checkList.pageWithoutMetaDescription) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page Without Meta Description</td>
                    <td>
                        A meta description is an HTML element that summarizes a
                        webpage's content. This short description shows up in
                        the search engine results page (SERP) below the page
                        title and URL.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.pageWithoutH1) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page Without H1</td>
                    <td>
                        The header 1 (h1) tag is considered important to help
                        both users and search engines to quickly understand what
                        content they can expect to find on the page.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.missingAltAttribute) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>
                        Missing Alt Attribute on Images{' '}
                        <span className="font-bold italic">
                            ({checkList.missingAltAttribute} images missing alt
                            attribute)
                        </span>
                    </td>
                    <td>
                        Alternative text, when correctly added to an image,
                        conveys meaning about what the image is to people who
                        cannot see it.
                    </td>
                </tr>
            );
            index++;
        }
        if (
            checkList.linkLeadToHttpPageOnHttpsSite &&
            checkList.linkLeadToHttpPageOnHttpsSite.length
        ) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Link Lead to Http on Https site</td>
                    <td>
                        There are{' '}
                        {checkList.linkLeadToHttpPageOnHttpsSite.length} links
                        lead to HTTP page:
                        <ul className="list-disc">
                            {checkList.linkLeadToHttpPageOnHttpsSite.map(
                                (item, index) =>
                                    index < 5 && (
                                        <li className="break-words">{item}</li>
                                    )
                            )}
                        </ul>
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.BlockedInternalResourceInRobotsTxt) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Resource got block by robotsTxt file</td>
                    <td>
                        Google bot cannot crawl resources like script, css or
                        image. Consider open these resource so google bot could
                        resolve and render correct version of your website!
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.missingHreflangAndLangAttribute) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Missing Hreflang and HTML Lang Attribute</td>
                    <td>
                        If website have others language version, consider using
                        hreflang and HTML lang attribute.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.noFollowAttributeInInternalLink) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>No Follow Attribute On Internal Links</td>
                    <td>
                        Page contains{' '}
                        {checkList.noFollowAttributeInInternalLink} internal
                        links with no-follow attribute.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.tooManyJavascriptAndCssFiles) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page contains too many JS and CSS files</td>
                    <td>
                        Consider reduce number of required JS and CSS files to
                        improve page performance.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.underscoreUrl) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>URL contains underscore</td>
                    <td>Consider remove underscore in URL.</td>
                </tr>
            );
            index++;
        }
        if (checkList.tooManyParametersOnUrl) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>URL contains too many query parameters</td>
                    <td>Consider reduce number of query parameters on URL.</td>
                </tr>
            );
            index++;
        }
        if (
            checkList.brokenExternalImgs &&
            checkList.brokenExternalImgs.length
        ) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page contains broken external images</td>
                    <td>
                        There are {checkList.brokenExternalImgs.length} broken
                        external images on this page.
                    </td>
                </tr>
            );
            index++;
        }
        if (
            checkList.brokenExternalLinks &&
            checkList.brokenExternalLinks.length
        ) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Page contains broken external links</td>
                    <td>
                        There are {checkList.brokenExternalLinks.length} broken
                        external links on this page.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.encodingNotDeclare) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Document encoding not declare</td>
                    <td></td>
                </tr>
            );
            index++;
        }
        if (checkList.TemporaryRedirect) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Temporary Redirection Being Used</td>
                    <td>Consider using permanent redirect.</td>
                </tr>
            );
            index++;
        }
        if (checkList.UncompressedPage) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Un-Compressed Page</td>
                    <td>
                        Website not using any of compression methods (like
                        gzip). Consider using one for faster loading website.
                    </td>
                </tr>
            );
            index++;
        }
        if (checkList.uncompressedJsAndCssFile) {
            rows.push(
                <tr>
                    <td>{index}</td>
                    <td>Un-Compressed Js and Css Files</td>
                    <td>
                        Website load ({checkList.uncompressedJsAndCssFile})
                        un-compressed JS and CSS files. This lead to slower
                        loading time of website.
                    </td>
                </tr>
            );
            index++;
        }

        if (index === 1) {
            rows.push(
                <tr>
                    <td
                        colSpan={3}
                        className="text-center font-bold text-green-500 pt-6 border-t"
                    >
                        No Issues Found!
                    </td>
                </tr>
            );
        }

        return rows;
    };

    return (
        <>
            {isLoading.value ? (
                <div
                    role="status"
                    className="flex flex-wrap justify-center py-12"
                >
                    <svg
                        aria-hidden="true"
                        class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span class="sr-only">Processing...</span>
                    <div className="w-full"></div>
                    <span className="text-gray-400 font-medium text-lg">
                        Processing...
                    </span>
                </div>
            ) : (
                <section key="warning-check-list" className="p-2">
                    <table className="table-fixed w-full">
                        <thead className="[&>tr>td]:font-bold [&>tr>td]:pb-4">
                            <tr>
                                <td className="w-12">STT</td>
                                <td>ISSUES</td>
                                <td>DESCRIPTION</td>
                            </tr>
                        </thead>
                        <tbody className="[&>tr>td:first-child]:font-bold [&>tr>td]:py-3 [&>tr>td]:border-b [&>tr>td:last-child]:text-gray-500 [&>tr>td:last-child]:font-mono">
                            {constructIssueTable(warningCheckList.value)}
                        </tbody>
                    </table>
                </section>
            )}
        </>
    );
};

export default WarningChecklist;
