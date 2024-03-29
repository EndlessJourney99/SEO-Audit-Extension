import { Tab, TabContent, TabHeader, Tabs } from '../Tabs';
import Summarize from '@mui/icons-material/Summarize';
import Warning from '@mui/icons-material/Warning';
import Link from '@mui/icons-material/Link';
import Error from '@mui/icons-material/Error';
import Robot from '@mui/icons-material/SmartToy';
import RobotsTxt from '@mui/icons-material/PrecisionManufacturing';
import Image from '@mui/icons-material/Image';
import ViewHeadline from '@mui/icons-material/ViewHeadline';
import TabPanel from '../Tabs/TabPanel';
import Summary from './Summary';
import useInit from '../../hooks/useInit';
import BotRender from './BotRender';
import { GlobalSignal } from '../../signals/globalSignal';
import { useContext } from 'preact/hooks';
import { AppState } from '../../signals/globalContext';
import WarningChecklist from './WarningChecklist';
import ErrorCheckList from './ErrorChecklist';
import LinkAnalysis from './LinkAnalysis';
import HeaderTree from './HeaderTree';
import ImageAnalysis from './ImageAnalysis';
import { useSignal } from '@preact/signals';
import MetaRobotsCheck from './MetaRobotsCheck';

const Functions = () => {
    const state: GlobalSignal = useContext(AppState);
    const { docsInfo, IsProcessing, UpdateActiveTab, savedActiveTab } = useInit(
        state.tabInfo.value,
        state.updateSignal.value
    );

    return (
        <Tabs
            defaultKey={savedActiveTab.value ? savedActiveTab.value : 'Summary'}
            sideMenu={true}
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
                    icon={<ViewHeadline />}
                    tabKey="HeaderTree"
                    callBack={UpdateActiveTab}
                >
                    Header
                </Tab>
                <Tab
                    icon={<Link />}
                    tabKey="LinkDiagnostic"
                    callBack={UpdateActiveTab}
                >
                    Link Analysis
                </Tab>
                <Tab
                    icon={<Image />}
                    tabKey="ImageAnalysis"
                    callBack={UpdateActiveTab}
                >
                    Image Analysis
                </Tab>
                <Tab
                    icon={<Robot />}
                    tabKey="BotRender"
                    callBack={UpdateActiveTab}
                >
                    Bot Render
                </Tab>
                <Tab
                    icon={<RobotsTxt />}
                    tabKey="MetaRobots"
                    callBack={UpdateActiveTab}
                >
                    Check Meta-Robots
                </Tab>
            </TabHeader>
            <TabContent>
                <TabPanel
                    tabKey="Summary"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <Summary docsInfo={docsInfo} />
                </TabPanel>
                <TabPanel
                    tabKey="WarningChecklist"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <WarningChecklist />
                </TabPanel>
                <TabPanel
                    tabKey="ErrorChecklist"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <ErrorCheckList />
                </TabPanel>
                <TabPanel
                    tabKey="HeaderTree"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <HeaderTree docsInfo={docsInfo.value} />
                </TabPanel>
                <TabPanel
                    tabKey="LinkDiagnostic"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <LinkAnalysis docsInfo={docsInfo} />
                </TabPanel>
                <TabPanel
                    tabKey="ImageAnalysis"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <ImageAnalysis docsInfo={docsInfo} />
                </TabPanel>
                <TabPanel
                    tabKey="BotRender"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <BotRender />
                </TabPanel>
                <TabPanel
                    tabKey="MetaRobots"
                    className="p-4 rounded-lg bg-gray-50 h-full"
                >
                    <MetaRobotsCheck />
                </TabPanel>
            </TabContent>
        </Tabs>
    );
};

export default Functions;
