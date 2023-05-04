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
//         case 'RunFetchInBG':
//             // RunFetch(message.Data);
//             fetch(
//                 'https://chrome.google.com/webstore/detail/nofollow/dfogidghaigoomjdeacndafapdijmiid?hl=en'
//             )
//                 .then((val) => console.log(val))
//                 .catch((e) => console.error(e));
//             break;

//         default:
//             break;
//     }
// });

chrome.tabs.onRemoved.addListener((tabId, info) => {
    removeTabData(tabId);
    chrome.storage.local.remove(tabId.toString());
});

chrome.webNavigation.onCommitted.addListener((details) => {
    if (
        details.transitionType.indexOf('reload') > -1 ||
        details.transitionType.indexOf('link') > -1
    ) {
        removeTabData(details.tabId);
        chrome.storage.local.remove(details.tabId.toString());
    }
});

// async function RunFetch(urls: Array<string>) {
//     for (let i = 0; i < urls.length; i++) {}
// }
