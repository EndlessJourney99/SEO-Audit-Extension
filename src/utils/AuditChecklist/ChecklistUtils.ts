import { randomRange } from '../GlobalUtils';
import { JSDOM } from 'jsdom';

interface CertDetail {
    Common_Name: string;
    Organization: string;
    State_Province: string;
    Country: string;
    Subject_Alternative_Names: string;
    Issuer: string;
    Serial_Number: string;
    SHA1_Thumbprint: string;
    Key_Length: string;
    Signature_Algorithm: string;
    Secure_Renegotiation: string;
    IsTrusted: boolean;
    IsExpired: boolean;
}

const requestCertData = async (url: URL) => {
    const formData = new FormData();
    formData.append('r', randomRange(300, 400).toString());
    formData.append('host', url.origin);

    const objResponse = await fetch(
        'https://www.digicert.com/api/check-host.php',
        {
            method: 'POST',
            body: formData,
        }
    );

    const result: CertDetail = {} as CertDetail;
    if (objResponse.ok) {
        const dataResponse = await objResponse.text();
        const {
            window: { document },
        } = new JSDOM(dataResponse);

        const statusIndicator = Array.from(
            document.querySelectorAll('h2')
        ).pop();

        if (statusIndicator && statusIndicator?.className.indexOf('error') > -1)
            result.IsTrusted = false;
        else result.IsTrusted = true;

        let expireText = document
            .evaluate(
                "//p[contains(., 'The certificate expires')]",
                document,
                null,
                XPathResult.ANY_TYPE,
                null
            )
            .iterateNext() as HTMLParagraphElement;

        result.IsExpired = true;
        if (expireText) {
            const expirationIndicator =
                expireText.previousElementSibling as HTMLHeadElement;
            if (
                expirationIndicator &&
                expirationIndicator.className.indexOf('ok') > -1
            ) {
                result.IsExpired = false;
            }
        }

        return result;
    }
};

export default requestCertData;

//: https://www.digicert.com/help/
