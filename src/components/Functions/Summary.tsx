import { Signal } from '@preact/signals';
import useInit from '../../hooks/useInit';
import { DocumentInfo, TagName } from '../../types/Execution';

type props = {
    docsInfo: Signal<DocumentInfo | null>;
};

const CheckLengthTitle = (title: string): JSX.Element => {
    if (title.length < 40)
        return (
            <span className="text-yellow-500 font-mono text-sm">
                {title.length} characters
            </span>
        );
    if (title.length >= 40 && title.length <= 55)
        return (
            <span className="text-green-600 font-mono text-sm">
                {title.length} characters
            </span>
        );

    return (
        <span className="text-red-500 font-mono text-sm">
            {title.length} characters
        </span>
    );
};

const CheckLengthDescription = (description: string): JSX.Element => {
    if (description.length < 150)
        return (
            <span className="text-yellow-500 font-mono text-sm">
                {description.length} characters
            </span>
        );
    if (description.length >= 150 && description.length <= 160)
        return (
            <span className="text-green-600 font-mono text-sm">
                {description.length} characters
            </span>
        );

    return (
        <span className="text-red-500 font-mono text-sm">
            {description.length} characters
        </span>
    );
};

const Summary = ({ docsInfo }: props) => {
    return (
        <section key="Summary">
            <table class="table-fixed w-full [&>tbody>tr>td:first-child]:font-semibold [&>tbody>tr>td:first-child]:w-1/4 [&>tbody>tr>td]:pb-2 pb-3 [&>tbody>tr>td:nth-child(2)]:align-baseline [&>tbody>tr>td]:break-words [&>tbody>tr>td:first-child]:align-baseline">
                <tbody>
                    <tr>
                        <td>
                            Title :<br></br>
                            {CheckLengthTitle(docsInfo.value?.title ?? '')}
                        </td>
                        <td>
                            {docsInfo.value?.title ?? (
                                <span className="text-gray-500">
                                    Title is not defined
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Description :<br></br>
                            {CheckLengthDescription(
                                docsInfo.value?.description ?? ''
                            )}
                        </td>
                        <td>{docsInfo.value?.description}</td>
                    </tr>
                    <tr>
                        <td>Keywords : </td>
                        <td>
                            {docsInfo.value?.keywords ?? (
                                <span className="text-gray-500">
                                    Keywords tag not defined
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>Url : </td>
                        <td>{docsInfo.value?.url}</td>
                    </tr>
                    <tr>
                        <td>Canonical : </td>
                        <td>
                            {docsInfo.value?.canonical ?? (
                                <span className="text-gray-500">
                                    Canonical is not defined
                                </span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>HTML Lang : </td>
                        <td>
                            {docsInfo.value?.htmlLang ?? (
                                <span className="text-gray-500">
                                    HTML lang is not defined
                                </span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr className="py-2" />
            <table className="table-auto w-full text-left">
                <thead className="border-b border-green-600 [&>tr>th]:pb-2">
                    <tr>
                        <th>h1</th>
                        <th>h2</th>
                        <th>h3</th>
                        <th>h4</th>
                        <th>h5</th>
                        <th>h6</th>
                        <th>Images</th>
                        <th>Links</th>
                    </tr>
                </thead>
                <tbody className="[&>tr:first-child>td]:pt-3">
                    <tr>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H1)}
                        </td>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H2)}
                        </td>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H3)}
                        </td>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H4)}
                        </td>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H5)}
                        </td>
                        <td>
                            {docsInfo.value?.countHeader &&
                                docsInfo.value?.countHeader(TagName.H6)}
                        </td>
                        <td>{docsInfo.value?.imageTags.length}</td>
                        <td>{docsInfo.value?.anchorTags.length}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Summary;
