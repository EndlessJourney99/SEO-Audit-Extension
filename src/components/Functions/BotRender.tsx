import { useSignal } from '@preact/signals';
import useRender from '../../hooks/useRender';
import { GlobalSignal } from '../../signals/globalSignal';
import { useContext } from 'preact/hooks';
import { AppState } from '../../signals/globalContext';
import userAgentsData from '../../../public/UserAgents.json';
import Notify from '../Notify';

const BotRender = () => {
    const state: GlobalSignal = useContext(AppState);

    const userAgent = useSignal('');
    const { isRendering, RenderHandle, isNotify, notifyMsg, notifyType } =
        useRender();

    return (
        <section key="BotRender">
            <div className="flex flex-wrap gap-1 justify-center mb-3">
                <select
                    id="countries"
                    onChange={(e) => (userAgent.value = e.currentTarget.value)}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5 cursor-pointer"
                >
                    <option selected disabled value="">
                        -- Select User-Agent --
                    </option>
                    {userAgentsData.map((item) => (
                        <option value={item.user_agent}>{item.name}</option>
                    ))}
                </select>

                {!isRendering.value ? (
                    <button
                        className="rounded-md bg-blue-400 hover:bg-blue-600 text-white font-bold w-1/5 p-3"
                        onClick={() =>
                            RenderHandle(
                                state.tabInfo.value.url ?? '',
                                userAgent.value
                            )
                        }
                    >
                        Render
                    </button>
                ) : (
                    <button
                        className="rounded-md bg-gray-400 text-white font-bold w-1/5 p-3"
                        disabled
                    >
                        Processing
                    </button>
                )}
            </div>
            <Notify
                visible={isNotify}
                msg={notifyMsg.value}
                notifyType={notifyType.value}
                timeOut={2000}
            />
        </section>
    );
};

export default BotRender;
