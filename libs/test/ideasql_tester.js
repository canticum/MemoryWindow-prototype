var ideasql = require("../ideasql.js")();

ideasql.query("台中 一中", 20, (data) => {
    console.log(data);
});
