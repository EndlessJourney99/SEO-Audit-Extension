import useErrorCheckList, {
    ErrorListType,
} from '../../hooks/useErrorChecklist';

const constructIssueTable = (checkList: ErrorListType) => {
    let rows = new Array<JSX.Element>();
    let index = 1;

    if (checkList.missingTitleTag) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Page doesn't have title tag</td>
                <td></td>
            </tr>
        );
        index++;
    }
    if (checkList.brokenCanonical) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Page canonical is in-correct</td>
                <td></td>
            </tr>
        );
        index++;
    }
    if (checkList.multipleCanonicalUrl) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Page defined more than 1 canonical URL</td>
                <td>Only use 1 canonical URL per page!</td>
            </tr>
        );
        index++;
    }
    if (checkList.nonSecurePage) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Page not using HTTPS protocol</td>
                <td></td>
            </tr>
        );
        index++;
    }
    if (checkList.missConfiguredViewPort) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>View-Port not configured</td>
                <td></td>
            </tr>
        );
        index++;
    }
    if (checkList.hrefLangValueIssue) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Hreflang value incorrect</td>
                <td>
                    Hreflang value must using ISO_639_1 for language code and
                    ISO_3166_1_Alpha2 for country code. Check your hreflang
                    value if it is in correct format.
                </td>
            </tr>
        );
        index++;
    }
    if (checkList.mixedContent) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Page contains mixed contents</td>
                <td>
                    Page contains mixed contents with HTTP protocol. Consider
                    remove or update these mixed content.
                </td>
            </tr>
        );
        index++;
    }
    if (checkList.brokenInternalJsAndCss) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Broken internal JS and CSS links</td>
                <td>
                    there are {checkList.brokenInternalJsAndCss} broken internal
                    JS and CSS on this page.
                </td>
            </tr>
        );
        index++;
    }
    if (checkList.brokenInternalImage && checkList.brokenInternalImage.length) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Broken internal images</td>
                <td>
                    there are {checkList.brokenInternalImage.length} broken
                    internal images on this page.
                </td>
            </tr>
        );
        index++;
    }
    if (checkList.brokenInternalLinks && checkList.brokenInternalLinks.length) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Broken internal links</td>
                <td>
                    there are {checkList.brokenInternalLinks.length} broken
                    internal links on this page.
                </td>
            </tr>
        );
        index++;
    }
    if (checkList.IncorrectHreflangLink) {
        rows.push(
            <tr>
                <td>{index}</td>
                <td>Hreflang link is incorrect</td>
                <td></td>
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

const ErrorCheckList = () => {
    const { errorCheckList, isLoading } = useErrorCheckList();

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
                            {constructIssueTable(errorCheckList.value)}
                        </tbody>
                    </table>
                </section>
            )}
        </>
    );
};

export default ErrorCheckList;
