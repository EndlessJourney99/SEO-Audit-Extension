import { useContext } from 'preact/hooks';
import { GlobalSignal } from '../signals/globalSignal';
import { AppState } from '../signals/globalContext';
import { storageName } from '../utils/GlobalUtils';
import { useIndexedDB } from '../hooks/IndexedDB';

interface props {
    title: string;
    version: string;
}

const Header = ({ title, version }: props) => {
    const state: GlobalSignal = useContext(AppState);
    const { clear } = useIndexedDB(storageName);

    const cleanDB = async () => {
        await clear();
        state.updateSignal.value += 1;
    };

    return (
        <header className="border-b border-gray-500 pb-2 grid grid-cols-4 ">
            <div className="col-span-3">
                <h2 className="font-bold">{title}</h2>
                <span className="text-xs antialiased text-gray-600">
                    v{version}
                </span>
            </div>
            <div className="col-auto text-right" id="info-contact-section">
                <button
                    className="py-2 px-10 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-bold"
                    onClick={cleanDB}
                >
                    Re-Crawl
                </button>
            </div>
        </header>
    );
};

export default Header;
