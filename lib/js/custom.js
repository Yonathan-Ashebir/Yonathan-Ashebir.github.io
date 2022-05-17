/* by Yonathan Ashebir */
const NORMAL = 0;
const IGNORE_CASE = 1;
const CONTAINS = 2;
function areEqual(str1, str2, ignoreCase = false) {
    if (str1 == null || str2 == null) return str1 = str2;
    if (ignoreCase) {
        return str2.toLowerCase() == str1.toLowerCase()
    } else {
        return str1.trim() == str2.trim();
    }
}
function includes(a, b, ignoreCase = false) {// if a contains b
    if (a == null || b == null) throw "null argument(s)";
    if (typeof (a) != "string" || typeof (b) != "string") throw "illegal argument(s)"
    if (ignoreCase) {
        a = a.toLowerCase();
        b = b.toLowerCase();
    }
    return a.includes(b)
}


function forAttr(attrs, means, ...objects) {
    if (attrs == null) throw "null argument(s)";
    let ignoreCase = false;
    let testContain = false;
    if (means != null) {
        if (means.length != null) for (arg in means) {
            if (arg == IGNORE_CASE) ignoreCase = true; else {
                if (arg == testContain) testContain = true;
            }
        } else {
            if (!means == NORMAL) {
                if (means == IGNORE_CASE) ignoreCase = true; else {
                    if (means == CONTAINS) testContain = true;
                }
            }
        }
    }
    if (attrs.length == null) { throw "illegal argument(s)" } else if (typeof (attrs) == "string") attrs = [attrs];

    let matchFound = false;
    main: for (let ind = 0; ind < objects.length; ind++) {
        let element = objects[ind];
        if (typeof (element) == "string") {
            for (attr in attrs) {
                attr = attrs[attr]
                if (testContain) {
                    if (includes(attr, element, ignoreCase)) { matchFound = true; continue main; }
                }
                else {
                    if (areEqual(attr, element, ignoreCase)) { matchFound = true; continue main; }
                }
            }
            matchFound = false;
        } else if (typeof (element) == "function" && matchFound) { element() }
    }
}

// window.onload= () => { setTimeout(()=>{document.body.style.backgroundColor = "red" },1000);}
function showTarget(event) {
    $($(event.target).attr("yt-target")).addClass("show")
}
function toggleShowTarget(event) {
    let $target = $(event.target.getAttribute("yt-target"))
    if ($target.hasClass("show")) { $target.removeClass("show") } else { $target.addClass("show") }
}
function show(event) {
    $(event.target).addClass("show")
}
function hide(event) {
    $(event.target).removeClass("show")
}
function toggleLang() {
    if (!isAmh) {
        $("#lang-selector").attr("href", "./lib/css/amh.css"); $("#lang-btn").text("Eng");
        isAmh = true;
        $(iframe.contentDocument.querySelector("#lang-selector")).attr("href", "./lib/css/amh.css")
    } else {
        $("#lang-selector").attr("href", "./lib/css/en.css"); $("#lang-btn").text("አማ");
        isAmh = false;
        $(iframe.contentDocument.querySelector("#lang-selector")).attr("href", "./lib/css/en.css")
    }
}
function inputDigits(event) {
    try {
        validateInput(event)
        changeFocus(event)
    } catch (err) { console.error(err) }
}
function validateInput() {
    if (window.event == null || (window.event.type != "keydown" && window.event.type != "keyup")) return;
    let $target = $(window.event.target)
    let type = $target.attr("yt-type")
    if (type == "") type = null;
    let maxLength = parseInt($target.attr("yt-max-length"));
    let value = window.event.target.value, newValue = value;
    let keyCode = window.event.keyCode;
    if (keyCode == 8) {
        if (value != "") newValue = value.slice(0, value.length - 2);
    }
    switch (type) {
        case "natural": {
            if (keyCode > 48 && keyCode < 58) newValue += window.event.key;
            break;
        }
        case "whole": {
            if (keyCode > 47 && keyCode < 58) newValue += window.event.key;
            break;
        }
        case "integer": {
            if (keyCode > 47 && keyCode < 58 || keyCode == 189) newValue += window.event.key;
            break;
        }
        case "boolean": {
            if (keyCode == 9) {
                if (value == "true") {
                    newValue = "false"
                } else if (value = "TRUE") {
                    newValue = "FALSE"
                } else if ("false") {
                    newValue = "true";
                } else {
                    newValue = "TRUE"
                }
            }
        }
    }
    if (maxLength > 0 && newValue != value && newValue.length > maxLength && (type != "boolean")) {
        newValue = window.event.key;
    }
    if (value != newValue) {
        window.event.target.value = newValue;
    }

}
function changeFocus() {
    if (window.event == null || window.event.type != "keydown") return false;

    let event = window.event, target = event.target, direction = 0;

    let type = target.getAttribute("type")
    if (type == "button") {
        direction = 1;
    }
    if (target.value.length == parseInt(target.getAttribute("yt-max-length"))) {
        direction = 1;
    }
    if ((event.keyCode == 8 && event.target.value.length == 0) || event.keyCode == 37) {
        direction = -1;
    } else if (event.keyCode == 39 || event.keyCode == 9) {
        direction = 1
    }
    //TODO: issues with arrow navigation on inputs with lenght>1
    if (direction == 1) {
        let nextFocus = document.querySelector(target.getAttribute("yt-next-focus"));
        if (nextFocus != null) {
            nextFocus.focus()
        } else if (target.nextElementSibling != null) target.nextElementSibling.focus();
    } else if (direction == -1) {
        let previousFocus = document.querySelector(target.getAttribute("yt-previous-focus"));
        if (previousFocus != null) {
            previousFocus.focus()
        } else if (target.previousElementSibling != null) {
            previousFocus = target.previousElementSibling;
            previousFocus.focus()
        };
        if (previousFocus != null && event.keyCode == 8) {
            let previousValue = previousFocus.value;
            if (previousValue != null && previousValue != "") {
                previousFocus.value = previousValue.slice(0, -1);
            }
        }
    }
}
function notify(header, content, time, iconString) {
    if (header != null) try {
        parent.showToast(header, content, time, iconString)
    } catch (err) { alert(header) }
}
function getField(data, name) {
    for (let ind = 0; ind < data.length; ind++) {
        const entry = data[ind];
        if (entry["name"] == name) return entry["value"]
    }
}

//server part
{
    var user, isAmh = false;
    var
        signIn = function (accountNo, password) {
            if (user == null)
                user = getUserInfo(accountNo, password);
            if (user != null) {
                saveData();
                return true;
            }
            else {
                return false;
            }
        }
    let serverDataInitial = {
        users: [
            {
                type: "normal-saving", accountNumber: 1023456789101, password: "12345678-1", name: "Yonathan Ashebir Demeke", avatar: "./images/avatar-1.jpg", contact: { phone: 0912345667, email: "yonatha12345678910@gmail.com" }, address: { country: "Ethiopia", region: "AddisAbaba", zone: "Akaki Kaliti Sub-city", wereda: 03, kebeke: 01, houseNumber: 1234 }, history: [{ date: new Date().toLocaleString(), where: "Akaki Branch", after: 400 },
                { date: new Date(new Date().getMilliseconds() - 182000).toLocaleString(), where: "Akaki Branch", after: 500 }
                ], others: { id: "./images/id-1.jpeg" }
            },
            {
                type: "admas", accountNumber: 1023456789102, password: "12345678-2", name: "Nahom Teferi Mekonen", avatar: "./images/avatar-1.jpg", contact: { phone: 0912356697, email: "nahom4839@gmail.com" }, address: { country: "Ethiopia", region: "AddisAbaba", zone: "Akaki Kaliti Sub-city", wereda: 12, kebeke: 04, houseNumber: 1234 }, history: [
                    { date: new Date().toLocaleString(), where: "Akaki Branch", after: 800 },
                    { date: new Date(new Date().getMilliseconds() - 780000).toLocaleString(), where: "Akaki Branch", after: 1000 }
                ], others: { id: "./images/id-1.jpeg" }
            },
            {
                type: "nigat", accountNumber: 1023456789103, password: "12345678-3", name: "Shewit Worku Yigerem", avatar: "./images/avatar-1.jpg", contact: { phone: 0934568219, email: "she_shewit@gmail.com" }, address: { country: "Ethiopia", region: "Amhara Region", zone: "North Gondar", wereda: 03, kebeke: 01, houseNumber: 1234 }, history: [
                    { date: new Date().toLocaleString(), where: "Akaki Branch", after: 800 },
                    { date: new Date(new Date().getMilliseconds() - 70000).toLocaleString(), where: "Akaki Branch", after: 50 }
                ], others: { id: "./images/id-1.jpeg" }
            }
        ],
        globalNotices: [
            { title: "Wider Scope", details: "Five more branches were opened in the south-western parts of the country, in regions of..." },
            {
                title: "App Update", details: "We are glad to announce the new update to the mobile backing application; bringing new features..."
            },
            {
                title: "Happy Christmas", details: "..."
            }
        ],
        messages: []
    }, serverData;
    var
        setupServer = function () {
            let data;
            if (document.cookie != null && document.cookie != "") {
                try { data = JSON.parse(document.cookie) } catch (err) { console.log(err) }
            }
            if (data != null && data.serverData != null) serverData = data.serverData; else { serverData = serverDataInitial; }

        },
        saveData = function () {
            let user = window.user;
            if (user == null) user = {};
            let lastVisited;
            try {
                lastVisited = iframe.contentWindow.document.URL;
            } catch (error) {
                console.log("From Yonathan: Cross origin reference is not allowed.")
                lastVisited = $("iframe").attr("src");
            }
            try { document.cookie = JSON.stringify({ accountNumber: user.accountNumber, password: user.password, isAmh: isAmh, lastVisited: lastVisited }) + ";expires=" + new Date(new Date().getTime() * 2); } catch (err) { console.log(err) }
        },
        getUserInfo = function (acc_no, password) {
            for (let ind = 0; ind < serverData.users.length; ind++) {
                const user = serverData.users[ind];
                if (user.accountNumber != acc_no) continue;
                if (user.password == password) return user;
            }
            return null;
        },
        checkForUser = function (name, accountNumber) {
            for (let ind = 0; ind < serverData.users.length; ind++) {
                const user = serverData.users[ind];
                if (user.accountNumber != accountNumber) continue;
                if (name.toLowerCase().trim() != user.name.toLocaleLowerCase.trim()) return 1;
                return 2;
            }
            return 0;
        },
        deduct = function (amount) {
            if (!(amount > 0) || user == null) throw new Error("illegal argument(s)/state")
            let amountBefore = 0;
            if (user.history[0] != null) {
                amountBefore = user.history[0].after;
            }
            if (amountBefore < amount) return false;
            user.history.unshift({ date: new Date().toLocaleString(), where: "Browser", after: amountBefore - amount });
            saveData();
            return true;
        },
        pushMessage = function (message) {
            if (message == null || message.message == null || (message.user == null && (message.name == null || message.email == null))) throw new Error("illegal argument(s)")
            serverData.messages.push(message)
            saveData();
        }
    setupServer();
}