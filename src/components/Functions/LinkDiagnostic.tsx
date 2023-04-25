import { Signal, computed } from '@preact/signals';
import {
    DocumentInfo,
    HTMLAnchor,
    RequestMessage,
} from '../../types/Execution';
import { GlobalSignal } from '../../signals/globalSignal';
import { useContext } from 'preact/hooks';
import { AppState } from '../../signals/globalContext';
import { IsLinkInternal } from '../../utils/AuditChecklist/ChecklistUtils';
import { ScrollToElem, TriggerHighlight } from '../../utils/SendCommand';
import { Accordion, AccordionBody, AccordionHeader } from '../Accordion';

type props = {
    docsInfo: Signal<DocumentInfo | null>;
};

const getInternalLinks = (
    links: HTMLAnchor[] | undefined,
    currentUrl: string
) => {
    if (!links) return [];
    const internalLinks = links.filter(
        (i) =>
            i.href?.length &&
            !i.href?.startsWith('#') &&
            !i.href?.startsWith('tel:') &&
            IsLinkInternal(i.href, new URL(currentUrl))
    );

    return internalLinks;
};

const countExternalLinks = (
    links: HTMLAnchor[] | undefined,
    currentUrl: string
) => {
    if (!links) return [];

    const externalLinks = links.filter(
        (i) =>
            i.href?.length &&
            !i.href?.startsWith('#') &&
            !i.href?.startsWith('tel:') &&
            !IsLinkInternal(i.href, new URL(currentUrl))
    );

    return externalLinks;
};

const noFollowLinks = (links: HTMLAnchor[] | undefined): Array<HTMLAnchor> => {
    if (!links) return [];

    const noFollowLinks = links.filter(
        (i) =>
            i.href?.length &&
            !i.href?.startsWith('#') &&
            !i.href?.startsWith('tel:') &&
            i.rel == 'nofollow'
    );

    return noFollowLinks;
};

const LinkDiagnostic = ({ docsInfo }: props) => {
    const state: GlobalSignal = useContext(AppState);

    const ComputedNoFollowLinks = computed(() =>
        noFollowLinks(docsInfo.value?.anchorTags)
    );

    const ComputedInternalLinks = computed(() =>
        getInternalLinks(
            docsInfo.value?.anchorTags,
            state.tabInfo.value.url ?? ''
        )
    );

    const ComputedExternalLinks = computed(() =>
        countExternalLinks(
            docsInfo.value?.anchorTags,
            state.tabInfo.value.url ?? ''
        )
    );

    return (
        <section key="LinkDiagnostic">
            <table class="table-fixed w-full [&>tbody>tr>td:first-child]:font-semibold [&>tbody>tr>td:first-child]:w-1/4 [&>tbody>tr>td]:pb-2 pb-3 [&>tbody>tr>td:nth-child(2)]:align-baseline [&>tbody>tr>td]:break-words [&>tbody>tr>td:first-child]:align-baseline">
                <tbody>
                    <tr>
                        <td>Total Links :</td>
                        <td>{docsInfo.value?.anchorTags.length} links</td>
                    </tr>
                    <tr>
                        <td>Internal Links :</td>
                        <td>{ComputedInternalLinks.value.length} links</td>
                    </tr>
                    <tr>
                        <td>External Links :</td>
                        <td>{ComputedExternalLinks.value.length} links</td>
                    </tr>
                </tbody>
            </table>

            <hr className="py-2" />

            <Accordion isOpen={false} className="pb-4">
                <AccordionHeader>
                    No-Follow Links{' '}
                    <span className="font-normal text-base italic">
                        ({ComputedNoFollowLinks.value.length} links)
                    </span>
                </AccordionHeader>
                <AccordionBody className="max-h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                    <ul className="whitespace-normal break-all [&>li]:pb-1 list-decimal list-inside [&>li]:cursor-pointer">
                        {ComputedNoFollowLinks.value.map((item) => (
                            <li
                                onMouseOver={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        true
                                    )
                                }
                                onMouseLeave={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        false
                                    )
                                }
                                onClick={() =>
                                    ScrollToElem(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1
                                    )
                                }
                            >
                                {item.representString}
                            </li>
                        ))}
                    </ul>
                </AccordionBody>
            </Accordion>

            <hr className="py-2" />

            <Accordion isOpen={false} className="pb-4">
                <AccordionHeader>
                    External Links{' '}
                    <span className="font-normal text-base italic">
                        ({ComputedExternalLinks.value.length} links)
                    </span>
                </AccordionHeader>
                <AccordionBody className="max-h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                    <ul className="whitespace-normal break-all [&>li]:pb-1 list-decimal list-inside [&>li]:cursor-pointer">
                        {ComputedExternalLinks.value.map((item) => (
                            <li
                                onMouseOver={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        true
                                    )
                                }
                                onMouseLeave={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        false
                                    )
                                }
                                onClick={() =>
                                    ScrollToElem(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1
                                    )
                                }
                            >
                                {item.representString}
                            </li>
                        ))}
                    </ul>
                </AccordionBody>
            </Accordion>

            <hr className="py-2" />

            <Accordion isOpen={false} className="pb-4">
                <AccordionHeader>
                    Internal Links{' '}
                    <span className="font-normal text-base italic">
                        ({ComputedInternalLinks.value.length} links)
                    </span>
                </AccordionHeader>
                <AccordionBody className="max-h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                    <ul className="whitespace-normal break-all [&>li]:pb-2 list-decimal list-inside [&>li]:cursor-pointer">
                        {ComputedInternalLinks.value.map((item) => (
                            <li
                                onMouseOver={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        true
                                    )
                                }
                                onMouseLeave={() =>
                                    TriggerHighlight(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1,
                                        false
                                    )
                                }
                                onClick={() =>
                                    ScrollToElem(
                                        item.uniqueId,
                                        state.tabInfo.value.id ?? -1
                                    )
                                }
                            >
                                {item.representString}
                            </li>
                        ))}
                    </ul>
                </AccordionBody>
            </Accordion>
        </section>
    );
};

export default LinkDiagnostic;
