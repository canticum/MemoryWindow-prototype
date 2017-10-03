exports.project = {
    TITLE_MAIN: "記憶窗櫺",
    SUBTITLE: "一個共築臺中印象的角落",
    TITLE: this.TITLE_MAIN + "—" + this.SUBTITLE,
    LOGO_PATH: "./element/logo_2.png"
};

exports.luna = {
    COLUMN: 8, ROW: 4,
    CARD: {
        BORDER_WIDTH: 10,
        BORDER_STYLE: 'inset',
        BORDER_COLOR: ['#cecece', 'springgreen'], //#3333ff'
        COLOR: '#373737'
    },
    FLIP_TIME_OUT: 5000, //ms
    SYSTEM_LOGO_TIME_OUT: 7000, //ms
    SHOW_INTERVAL: 2500, //ms
    SHOW_STAY: 1500, //ms
    QRCODE: '@QR_CODE_TOKEN',
    TITLE_RATIO: 0.6,
    TOP_HEIGHT_RATIO: 0.08,
    MOD: function (row) {
        return (row > 2) ? 1 : ((row === 1) ? 0.70 : 0.95);
    }
};

exports.umbra = {
    URL: 'http://wm.localstudies.tw'
};

exports.data = {
    FILETYPES: ['jpg', 'png', 'JPG', 'PNG'],
    LIMIT: 20,
    TWDC: {
        URL: "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc"
    },
    IDEASQL: {
        URL: "http://designav.io/api/image/search/",
        MULTI_URL: "http://designav.io/api/image/search_multi/",
        WB_URL: "http://designav.io/api/image/wordbreak/"
    }
};
