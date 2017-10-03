
var DC = require('../DataCenter.js');

var data = {
    client: 'me',
    text: '台中'
};


var dc = new DC(20, function () {
    if (dc) {
        dc.getResult(data, (result) => {
//            console.log(result.record_set.length);
            console.log(result);
        });
    }
});

