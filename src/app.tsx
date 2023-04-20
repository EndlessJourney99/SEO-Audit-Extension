import { useContext, useEffect } from 'preact/compat';
import { AppState } from './signals/globalContext';
import Header from './components/Header';
import Functions from './components/Functions';
import Footer from './components/Footer';
import { GlobalSignal } from './signals/globalSignal';

export const App = () => {
    const state: GlobalSignal = useContext(AppState);
    // const tabInfo = useSignal<chrome.tabs.Tab>({} as chrome.tabs.Tab);

    useEffect(() => {
        // requestCertData(new URL('https://elitedental.com.vn/')).then(
        //     (result) => {
        //         console.log(result);
        //     }
        // );
        // testRedirectInfo();
    }, []);

    return (
        <div className="container mx-auto">
            <Header
                title={state.manifest.value.name}
                version={state.manifest.value.version}
            />
            <Functions />
            <Footer />
        </div>
    );
};
