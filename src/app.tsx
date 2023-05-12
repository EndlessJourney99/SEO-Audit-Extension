import { useContext } from 'preact/compat';
import { AppState } from './signals/globalContext';
import Header from './components/Header';
import Functions from './components/Functions';
import Footer from './components/Footer';
import { GlobalSignal } from './signals/globalSignal';

export const App = () => {
    const state: GlobalSignal = useContext(AppState);

    const StartApp = () => {
        state.isStarted.value = true;
        chrome.storage.local.set({ [state.tabInfo.value.id ?? -1]: 'Started' });
    };

    return (
        <div className="container-custom px-7 py-5 mx-auto">
            <Header
                title={state.manifest.value.name}
                version={state.manifest.value.version}
                isStart={state.isStarted.value}
            />
            {state.isStarted.value ? (
                <Functions />
            ) : (
                <section className="p-11 text-center">
                    <button
                        className="py-3 px-20 rounded-md bg-blue-500 hover:bg-blue-600 font-bold text-white uppercase"
                        onClick={StartApp}
                    >
                        Start
                    </button>
                </section>
            )}
            <Footer />
        </div>
    );
};

// wYy/llXUf/9AWqEU
