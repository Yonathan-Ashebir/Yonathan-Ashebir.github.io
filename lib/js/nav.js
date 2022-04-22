//root navigation java script using embeded html files
//should be coordinated with the setup function each page

{
    let records = [];
    let forwardEnabled = false;
    let pos = 0;
    const findByNamePrefix = '-'
    const PANEL_HOST = "#panelHost"

    var
        navigateTo = function (...params) {//params can be a single records index num, record name, url with params for poping this panel back;
            if (params == null || params.length == 0 || params[0] == null) {
                throw new Error("null argument(s)")
            } else if (typeof params[1] == "number") {
                if (params[0] > -1 || params[0] < records.length) gotoOld(ind)
            }
            else if (typeof params[0] == "string") {
                if (params[0].charAt(0) == findByNamePrefix) {
                    for (let ind in records) {
                        let name = params[0].slice(1).trim()
                        if (records[ind].name == name) {
                            gotoOld(ind);
                        }
                    }
                    throw new Error("can not find a matching record")
                } else {
                    openNew(params.shift(),params );
                }
            }
            else {
                throw new Error("illegal argument(s)")
            }
        }
    var getRecords = function () {
        return Object.assign(records)
    }
    var getLength = function () {
        return records.length;
    }
    var getPanelPos = function () {
        return pos;
    }
    var setForwardSupport = function (enable) {
        if (typeof enable != "boolean") throw new Error("illegal argument(s)");
        forwardEnabled = enable;
    }
    var isForwardSupported = function () {
        return forwardEnabled;
    }
    var nextPanel = function () {
        if (!forwardEnabled || pos == records.length) throw new Error("unsupported operation");
        gotoOld(++pos);
    }
    var previousPanel = function () {
        if (pos == 0) throw new Error("unsupported operation");
        gotoOld(--pos);
    }
    var insertRecord = function (ind, name, url, params) {
        if (ind < 0 || ind > records.length) throw new Error("unsupported operation");
        if (ind <= pos) pos++;
        records = records.splice(ind, 0, { name: name, url: url, params: params });
    }
    var removeRecord = function (ind) {
        records = records.splice(ind, 1)
    }

    let
        openNew = function (destUrl, params) {
            let record = {};
            if (typeof params[0] == "string") {
                record.name = params.shift();
            }
            let host = $(PANEL_HOST);
            if(host==null)throw new Error ("no panel navigation host");
            record.url = getPanelUrl();
            record.params = params;
            records.push(record);
            pos = records.length;
            host.load(destUrl);

        },

        gotoOld = function (ind) {
            let host = $(PANEL_HOST);
            if (host == null) throw new Error("no panel navigation host");
            pos = ind;
            host.load(records[ind].url)
            setup(records[ind].params)
            return;
        }

}
