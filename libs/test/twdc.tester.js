var twdc = require("../twdc.js");

twdc.refresh((data) => {
    console.log('records.length = ' + data.length);

    for (i = 0; i < data.length; i++)
        console.log(data[i].identifier.split(":").pop() + ': ' + data[i].link);
});


