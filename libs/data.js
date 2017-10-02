module.exports = {
    Result,
    Record_Query,
    twdc_records
};

var twdc_records;

function Result(client, query_string) {
    this.client = client;
    this.query_str = query_string;
    this.record_set = [];
}

function Record_Query(url, text) {
    this.img_url = url;
    this.content = text;
}


