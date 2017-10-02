var ideasql = require("../ideasql.js");

ideasql.query("台中", 15, (data) => {
    console.log(data);
});
