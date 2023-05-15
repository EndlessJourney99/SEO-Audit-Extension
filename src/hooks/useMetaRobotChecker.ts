import { useSignal } from '@preact/signals';
import { FindMetaRobots, RuleConstruct } from '../utils/GlobalUtils';
import { GlobalSignal } from '../signals/globalSignal';
import { useContext } from 'preact/hooks';
import { AppState } from '../signals/globalContext';

export type MetaRobotsValue = {
    X_Robots_Header: string | null;
    Meta_Robots_Tag: string[] | null;
};

async function checkMetaRobots(currentUrl: URL, userAgent: string) {
    await chrome.declarativeNetRequest.updateDynamicRules(
        RuleConstruct(userAgent)
    );
    let result: MetaRobotsValue = {} as MetaRobotsValue;

    const objResponse = await fetch(currentUrl);
    if (objResponse.ok) {
        const x_robots = objResponse.headers.get('X-Robots-Tag');
        result.X_Robots_Header = x_robots;
        const contents = await objResponse.text();
        const metaRobotsValue = FindMetaRobots(contents);
        result.Meta_Robots_Tag = metaRobotsValue;
    }

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
    });

    return result;
}

const useMetaRobotsChecker = () => {
    const state: GlobalSignal = useContext(AppState);
    const processing = useSignal(false);
    const result = useSignal<MetaRobotsValue | null>(null);
    const userAgent = useSignal('');

    const processFnc = async () => {
        processing.value = true;

        const currentUrl = new URL(state.tabInfo.value.url ?? '');
        result.value = await checkMetaRobots(currentUrl, userAgent.value);

        processing.value = false;
    };

    return { processing, result, userAgent, processFnc };
};

export { useMetaRobotsChecker };
