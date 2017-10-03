var TWDC = require("../twdc.js")(20, () => {
    TWDC.query('臺中', (data) => {
        console.log('records.length = ' + data.length);
        for (i = 0; i < data.length; i++)
            console.log(data[i].img_url); //, data[i].content
    });
});

