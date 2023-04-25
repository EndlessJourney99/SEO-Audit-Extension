// import { randomRange } from '../GlobalUtils';

// interface CertDetail {
//     Common_Name: string;
//     Organization: string;
//     State_Province: string;
//     Country: string;
//     Subject_Alternative_Names: string;
//     Issuer: string;
//     Serial_Number: string;
//     SHA1_Thumbprint: string;
//     Key_Length: string;
//     Signature_Algorithm: string;
//     Secure_Renegotiation: string;
//     IsTrusted: boolean;
//     IsExpired: boolean;
// }

// const requestCertData = async (url: URL) => {
//     const formData = new FormData();
//     formData.append('r', randomRange(300, 400).toString());
//     formData.append('host', url.origin);

//     const objResponse = await fetch(
//         'https://www.digicert.com/api/check-host.php',
//         {
//             method: 'POST',
//             body: formData,
//         }
//     );

//     const result: CertDetail = {} as CertDetail;
//     if (objResponse.ok) {
//         const dataResponse = await objResponse.text();
//         const {
//             window: { document },
//         } = new JSDOM(dataResponse);

//         const statusIndicator = Array.from(
//             document.querySelectorAll('h2')
//         ).pop();

//         if (statusIndicator && statusIndicator?.className.indexOf('error') > -1)
//             result.IsTrusted = false;
//         else result.IsTrusted = true;

//         let expireText = document
//             .evaluate(
//                 "//p[contains(., 'The certificate expires')]",
//                 document,
//                 null,
//                 XPathResult.ANY_TYPE,
//                 null
//             )
//             .iterateNext() as HTMLParagraphElement;

//         result.IsExpired = true;
//         if (expireText) {
//             const expirationIndicator =
//                 expireText.previousElementSibling as HTMLHeadElement;
//             if (
//                 expirationIndicator &&
//                 expirationIndicator.className.indexOf('ok') > -1
//             ) {
//                 result.IsExpired = false;
//             }
//         }

//         return result;
//     }
// };
//: https://www.digicert.com/help/

export const GetRedirectionChain = async (url: URL) => {
    let redirectionChain: Array<{ redirectUrl: string; status: number }> =
        new Array<{ redirectUrl: string; status: number }>();
    const fnc = (details) => {
        redirectionChain.push({
            redirectUrl: details.redirectUrl,
            status: details.statusCode,
        });
    };
    chrome.webRequest.onBeforeRedirect.addListener(fnc, { urls: [url.href] }, [
        'responseHeaders',
    ]);

    await fetch(url);
    chrome.webRequest.onBeforeRedirect.removeListener(fnc);

    return redirectionChain;
};

export const IsLinkInternal = (link: string, internalUrl: URL) => {
    if (link.length === 0) return false;
    if (link.includes(internalUrl.hostname)) return true;
    if (
        link.startsWith('/') ||
        (!link.includes('http') && !link.includes('www'))
    )
        return true;
    return false;
};

// prettier-ignore
export const ISO_639_1_Language: string[] = [
    "zu","zh","za","yo","yi","xh","wo","wa","vo","vi","ve","uz","ur","uk","ug","ty","tw","tt","ts","tr","to","tn","tl","tk","ti","th","tg","te","ta","sw","sv",
    "su","st","ss","sr","sq","so","sn","sm","sl","sk","si","sg","se","sd","sc","sa","rw","ru","ro","rn","rm","qu","pt","ps","pl","pi","pa","os","or","om","oj",
    "oc","ny","nv","nr","no","nn","nl","ng","ne","nd","nb","na","my","mt","ms","mr","mn","ml","mk","mi","mh","mg","lv","lu","lt","lo","ln","li","lg","lb","la",
    "ky","kw","kv","ku","ks","kr","ko","kn","km","kl","kk","kj","ki","kg","ka","jv","ja","iu","it","is","io","ik","ii","ig","ie","id","ia","hz","hy","hu","ht",
    "hr","ho","hi","he","ha","gv","gu","gn","gl","gd","ga","fy","fr","fo","fj","fi","ff","fa","eu","et","es","eo","en","el","ee","dz","dv","de","da","cy","cv",
    "cu","cs","cr","co","ch","ce","ca","bs","br","bo","bn","bm","bi","bg","be","ba","az","ay","av","as","ar","an","am","ak","af","ae","ab","aa",
];

// prettier-ignore
export const ISO_3166_1_Alpha2_Country : string[] = [
    "AD", "AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BQ",
    "BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ",
    "EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW",
    "GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY",
    "KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV",
    "MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PS","PT","PW","PY","QA",
    "RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH",
    "TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","IS","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW",
];
