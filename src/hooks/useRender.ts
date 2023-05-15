import { batch, useSignal } from '@preact/signals';
import { NotifyType } from '../components/Notify';
import { DeviceViewport } from '../types/UserAgents';
import { IsMobileAgent, Since, RuleConstruct } from '../utils/GlobalUtils';
import userAgentsData from '../../public/UserAgents.json';

const BotRender = async (url: string, userAgent: string) => {
    await chrome.declarativeNetRequest.updateDynamicRules(
        RuleConstruct(userAgent)
    );

    if (chrome.runtime.lastError) {
        throw new Error(chrome.runtime.lastError.message);
    } else {
        const viewPort = IsMobileAgent(userAgent)
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
        if (IsMobileAgent(userAgent) && newWindow.tabs) {
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
