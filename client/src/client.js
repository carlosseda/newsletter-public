// import '../node_modules/clientjs/src/client.js';
import {FingerprintJS} from '@fingerprintjs/fingerprintjs';

export let getFingerprint = () => {

    // let client = new ClientJS();    
    // let fingerprint = client.getFingerprint();
    
    // return fingerprint;

    const fpPromise = FingerprintJS.load();

    (async () => {
        // Get the visitor identifier when you need it.
        const fp = await fpPromise
        const result = await fp.get()
    })()
};