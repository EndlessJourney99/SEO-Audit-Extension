import { HashMap } from './HashMap';

export enum UserAgent {
    GoogleBot_SmartPhone = 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    GoogleBot_Desktop = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    Browser = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
}

export const DeviceViewport = {
    Mobile: {
        width: 390,
        height: 844,
    },
    Desktop: {
        width: 1700,
        height: 900,
    },
};
