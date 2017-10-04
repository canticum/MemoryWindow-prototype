var xml = require("../xml.js")();
var cf = require("../../config.js").DATA;

//var url = "http://data.digitalculture.tw/taichung/oai?verb=ListRecords&metadataPrefix=oai_dc";

xml.fetch(cf.TWDC.URL, function (data) {
    console.log(data);
});