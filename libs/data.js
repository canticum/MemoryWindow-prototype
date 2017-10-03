exports.Result = function (client, query_string) {
    this.client = client;
    this.query_str = query_string;
    this.record_set = [];
};

exports.Record_Query = function (url, text) {
    this.img_url = url;
    this.content = text;
};


