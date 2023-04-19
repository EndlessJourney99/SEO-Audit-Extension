import { useContext, useEffect } from 'preact/hooks';
import { GlobalSignal } from '../../signals/globalSignal';
import { DocumentInfo, RequestMessage, TagName } from '../../types/Execution';
import { AppState } from '../../signals/globalContext';

type props = {
    docsInfo: DocumentInfo | null;
};

const branchStyle = (strTagName: string) => {
    const convertedTag = TagName[strTagName as keyof typeof TagName];
    switch (convertedTag) {
        case TagName.H1:
            return 'pl-1 text-3xl';
        case TagName.H2:
            return 'pl-5 text-2xl';
        case TagName.H3:
            return 'pl-10 text-xl';
        case TagName.H4:
            return 'pl-16 text-l';
        case TagName.H5:
            return 'pl-20 text-md';
        case TagName.H6:
            return 'pl-24 text-sm';
        default:
            return 'pl-0';
    }
};

const TriggerHighlight = (
    uniqueId: string,
    tabId: number,
    isHighligh: boolean
) => {
    chrome.tabs.sendMessage<RequestMessage>(tabId, {
        Command: isHighligh ? 'HighlightElement' : 'removeElementHighlight',
        OptionParameters: { elementId: uniqueId },
    });
};

const ScrollToElem = (uniqueId: string, tabId: number) => {
    chrome.tabs.sendMessage<RequestMessage>(tabId, {
        Command: 'ScrollToElem',
        OptionParameters: { elementId: uniqueId },
    });
};

const HeaderTree = ({ docsInfo }: props) => {
    const state: GlobalSignal = useContext(AppState);

    const renderTree = () => {
        const tree = docsInfo?.headerTree.map<JSX.Element>((item) => {
            return (
                <div
                    className={`pb-2 ${branchStyle(item.tagName)} cursor-pointer
                     hover:bg-blue-200`}
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
                    <div className="flex">
                        <label className="text-gray-900 font-medium">
                            {'<'}
                            {item.tagName}
                            {'>'}
                        </label>
                        {item.text ? (
                            <span className="ml-1 before:content-[':'] before:mr-2 text-gray-600 flex">
                                {item.text}
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            );
        });
        return tree;
    };
    return <section key="HeaderTree">{renderTree()}</section>;
};

export default HeaderTree;
