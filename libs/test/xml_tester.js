var xml = require("../xml.js");

var url = "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc";

xml.fetch(url, function (data) {
    console.log(data);
});