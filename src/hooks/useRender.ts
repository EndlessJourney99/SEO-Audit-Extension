import { batch, useSignal } from '@preact/signals';
import { TakeScreenShot } from '../utils/TakeScreenshotHandle';
import { NotifyType } from '../components/Notify';
import { DeviceViewport, UserAgent } from '../types/UserAgents';
import { Since } from '../utils/GlobalUtils';

const ruleConstruct = (userAgent: string) => {
    return {
        removeRuleIds: [1],
        addRules: [
            {
                id: 1,
                priority: 2,
                action: {
                    type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
                    requestHeaders: [
                        {
                            header: 'user-agent',
                            operation:
                                'set' as chrome.declarativeNetRequest.HeaderOperation,
                            value: userAgent,
                        },
                    ],
                },
                condition: {
                    urlFilter: '|https*',
                    resourceTypes: [
                        'main_frame' as chrome.declarativeNetRequest.ResourceType,
                        'xmlhttprequest' as chrome.declarativeNetRequest.ResourceType,
                    ],
                },
            },
        ],
    };
};

const BotRender = async (url: string, userAgent: string) => {
    await chrome.declarativeNetRequest.updateDynamicRules(
        ruleConstruct(userAgent)
    );

    if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
    } else {
        const viewPort =
            UserAgent.GoogleBot_SmartPhone === userAgent
                ? DeviceViewport.Mobile
                : DeviceViewport.Desktop;

        await chrome.browsingData.removeCache({
            originTypes: {
                unprotectedWeb: true,
                extension: false,
                protectedWeb: false,
            },
            since: Since(30, 'minutes'),
        });
        const newWindow = await chrome.windows.create({
            state: 'normal',
            type: 'popup',
            url: url,
            width: viewPort.width,
            height: viewPort.height,
        });
        if (UserAgent.GoogleBot_SmartPhone === userAgent && newWindow.tabs) {
            chrome.scripting.insertCSS({
                target: { tabId: newWindow.tabs[0].id ?? -1 },
                css: 'body::-webkit-scrollbar{display: none;}',
            });
        }

        // const tab = await chrome.tabs.create({
        //     url: url,
        //     active: false,
        // });

        // const base64Img = await chrome.scripting.executeScript({
        //     target: { tabId: tab.id ?? -1 },
        //     func: TakeScreenShot,
        // });

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1],
        });
        // chrome.tabs.remove(tab.id ?? -1);

        // return base64Img[0].result;
    }
};

const useRender = () => {
    const isRendering = useSignal(false);
    const isNotify = useSignal<boolean>(false);
    const notifyMsg = useSignal<string>('');
    const notifyType = useSignal<NotifyType>('Success');
    // const base64ScreenCapture = useSignal<string>('');
    const RenderHandle = async (url: string, userAgent: string) => {
        if (url.length === 0) {
            batch(() => {
                notifyMsg.value = 'Cannot get tab info!';
                isNotify.value = true;
                notifyType.value = 'Error';
            });
            throw new Error('Cannot get tab info!');
        }
        if (userAgent.length === 0) {
            batch(() => {
                notifyMsg.value = 'User-agent not specify!';
                isNotify.value = true;
                notifyType.value = 'Error';
            });
            throw new Error('User-agent not specify');
        }
        isRendering.value = true;
        // base64ScreenCapture.value = await BotRender(url, userAgent);
        await BotRender(url, userAgent);
        isRendering.value = false;
    };
    return { RenderHandle, isRendering, isNotify, notifyMsg, notifyType };
};

export default useRender;
