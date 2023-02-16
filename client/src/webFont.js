import {WebFont} from "webfontloader";

export let renderWebFont = () => {

    WebFont.load({
        google: {
            families: ['Ubuntu:700,700i', 'Ubuntu+Condensed:400']
        }
    });
}
