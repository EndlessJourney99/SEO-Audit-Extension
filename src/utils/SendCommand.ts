import { RequestMessage } from '../types/Execution';

export const TriggerHighlight = (
    uniqueId: string,
    tabId: number,
    isHighligh: boolean
) => {
    chrome.tabs.sendMessage<RequestMessage>(tabId, {
        Command: isHighligh ? 'HighlightElement' : 'removeElementHighlight',
        OptionParameters: { elementId: uniqueId },
    });
};

export const ScrollToElem = (uniqueId: string, tabId: number) => {
    chrome.tabs.sendMessage<RequestMessage>(tabId, {
        Command: 'ScrollToElem',
        OptionParameters: { elementId: uniqueId },
    });
};
