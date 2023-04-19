import { BackgroundMessage } from './types/Execution';
import { storageName } from './utils/GlobalUtils';
import { DBConfig, DbSchema } from './utils/IndexedDBConfig';

async function openDB(callback: (dbInstance: IDBDatabase) => void) {
    let db: IDBDatabase;
    const openRequest = self.indexedDB.open(DBConfig.name, DBConfig.version);

    openRequest.onerror = function (event: Event) {
        console.log("Everyhour isn't allowed to use IndexedDB?!" + this);
    };

    // upgrade needed is called when there is a new version of you db schema that has been defined
    openRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
        db = this.result;

        if (!db.objectStoreNames.contains(storageName)) {
            // if there's no store of 'storeName' create a new object store
            db.createObjectStore(storageName, { keyPath: 'key' }); //some use keyPath: "id" (basically the primary key) - unsure why yet
        }
    };

    openRequest.onsuccess = function (event) {
        db = this.result;
        if (callback) {
            callback(db);
        }
    };
}

const removeTabData = (tabId: number) => {
    openDB((db) => {
        const transaction = db.transaction(storageName, 'readwrite');
        const store = transaction.objectStore(storageName);

        transaction.oncomplete = (event) => console.log(event);

        store.delete(tabId);
    });
};

// chrome.runtime.onMessage.addListener(async function (
//     message: BackgroundMessage,
//     sender,
//     sendResponse
// ) {
//     switch (message.Command) {
//         case 'ListenOnClose':
//             break;

//         default:
//             break;
//     }
// });

chrome.tabs.onRemoved.addListener((tabId, info) => {
    removeTabData(tabId);
    
});


