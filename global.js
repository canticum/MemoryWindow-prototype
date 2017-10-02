const PROJECT_SUBTITLE = "一個共築臺中印象的角落";
const PROJECT_TITLE_SHORT = "記憶窗櫺";
const PROJECT_TITLE = PROJECT_TITLE_SHORT + "—" + PROJECT_SUBTITLE;
const COLUMN = 8, ROW = 4;
const CARD_BORDER = 10, BORDER_STYLE = 'inset';
const COLOR = {
    CARD: '#373737', //rgb(55,55,55)
    BORDER: ['#cecece', 'springgreen'] //#3333ff'
};
const FLIP_TIME_OUT = 5000; //ms
const SYSTEM_LOGO_TIME_OUT = 7000; //ms
const LOGO_PATH = "./element/logo_2.png";
const QRCODE_TOKEN = '@QR_CODE_TOKEN';
const UMBRA_URL = 'http://wm.localstudies.tw';
const TITLE_RATIO = 0.6;
const TOP_HEIGHT_RATIO = 0.08;
function MOD(row) {
    return (row > 2) ? 1 : ((row === 1) ? 0.70 : 0.95);
}
const SEARCH_DELAY = 3000;

module.exports = {
    PROJECT_SUBTITLE,
    PROJECT_TITLE_SHORT,
    PROJECT_TITLE,
    COLUMN, ROW,
    CARD_BORDER, BORDER_STYLE,
    COLOR,
    FLIP_TIME_OUT,
    SYSTEM_LOGO_TIME_OUT,
    LOGO_PATH,
    QRCODE_TOKEN,
    UMBRA_URL,
    TITLE_RATIO,
    TOP_HEIGHT_RATIO,
    MOD,
    SEARCH_DELAY
};