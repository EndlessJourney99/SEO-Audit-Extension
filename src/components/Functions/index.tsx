import { Tab, TabContent, TabHeader, Tabs } from '../Tabs';
import Summarize from '@mui/icons-material/Summarize';
import Warning from '@mui/icons-material/Warning';
import Link from '@mui/icons-material/Link';
import Error from '@mui/icons-material/Error';
import Robot from '@mui/icons-material/SmartToy';
import TabPanel from '../Tabs/TabPanel';
import Summary from './Summary';
import useInit from '../../hooks/useInit';
import BotRender from './BotRender';
import { GlobalSignal } from '../../signals/globalSignal';
import { useContext } from 'preact/hooks';
import { AppState } from '../../signals/globalContext';
import WarningChecklist from './WarningChecklist';
import ErrorCheckList from './ErrorChecklist';
import LinkDiagnostic from './LinkDiagnostic';

const Functions = () => {
    const state: GlobalSignal = useContext(AppState);
    const { docsInfo, IsProcessing, UpdateActiveTab, savedActiveTab } = useInit(
        state.tabInfo.value,
        state.updateSignal.value
    );

    return (
        <Tabs
            defaultKey={
                savedActiveTab.value
                    ? (savedActiveTab.value as string)
                    : 'Summary'
            }
            className="py-3"
        >
            <TabHeader>
                <Tab
                    icon={<Summarize />}
                    tabKey="Summary"
                    callBack={UpdateActiveTab}
                >
                    Summary
                </Tab>
                <Tab
                    icon={<Warning />}
                    tabKey="WarningChecklist"
                    callBack={UpdateActiveTab}
                >
                    Warning list
                </Tab>
                <Tab
                    icon={<Error />}
                    tabKey="ErrorChecklist"
                    callBack={UpdateActiveTab}
                >
                    Error list
                </Tab>
                <Tab
                    icon={<Link />}
                    tabKey="LinkDiagnostic"
                    callBack={UpdateActiveTab}
                >
                    Link Diagnostic
                </Tab>
                <Tab
                    icon={<Robot />}
                    tabKey="BotRender"
                    callBack={UpdateActiveTab}
                >
                    Bot Render
                </Tab>
            </TabHeader>
            <TabContent>
                <TabPanel
                    tabKey="Summary"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <Summary docsInfo={docsInfo} />
                </TabPanel>
                <TabPanel
                    tabKey="WarningChecklist"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <WarningChecklist />
                </TabPanel>
                <TabPanel
                    tabKey="ErrorChecklist"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <ErrorCheckList />
                </TabPanel>
                <TabPanel
                    tabKey="LinkDiagnostic"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <LinkDiagnostic docsInfo={docsInfo} />
                </TabPanel>
                <TabPanel
                    tabKey="BotRender"
                    className="p-4 rounded-lg bg-gray-50"
                >
                    <BotRender />
                </TabPanel>
            </TabContent>
        </Tabs>
    );
};

export default Functions;
