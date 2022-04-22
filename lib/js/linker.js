const linkFunctionAttr = "link-func"
const linkTrig = "link-trig"
const customCalls = "yt-calls"
const isOut = "out"
const isIn = "in"
const parentScroll = "parent-scrolled"


const unset = "unset"
var listenerRefresh = 100;
{
    let inOutHandlerData = [];

    let linkedFunctions = {};
    $().ready(function () {
        linkFunctions();
        startListening();
    })

    var linkFunctions = function () {
        linkedFunctions = {};
        let elements = document.querySelectorAll("*[" + linkFunctionAttr + "]")
        for (let ind = 0; ind < elements.length; ind++) {
            const element = elements[ind];
            const funcs = getNames(element.getAttribute(linkFunctionAttr));
            for (let ind = 0; ind < funcs.length; ind++) {
                const func = funcs[ind];
                if (linkedFunctions[func] != null) {
                    linkedFunctions[func]["children"].push(element)
                } else {
                    linkedFunctions[func] = { "children": [element] }
                }
            }
        }
        for (let func in linkedFunctions) {
            linkedFunctions[func]["function"] = function () {
                console.warn("unsupported operation: not implemented yet")
            };
            const elements = linkedFunctions[func]["children"];
            for (let ind = 0; ind < elements.length; ind++) {
                const element = elements[ind];
                let handlers = getNames(element.getAttribute(linkTrig))
                handlers.forEach(function (handlerName) {
                    setListener(element, handlerName, function (event) { linkedFunctions[func]["function"](event, linkedFunctions[func]["children"]); });
                });
            }
        }
        elements = document.querySelectorAll("*[" + customCalls + "]")
        for (let ind = 0; ind < elements.length; ind++) {
            const element = elements[ind];
            let calls = element.getAttribute(customCalls).split(')');
            for (let ind = 0; ind < calls.length; ind++) {
                const call = calls[ind];
                let func = call.substring(0, call.indexOf('(')).trim()
                if (!validateStr(func)) continue;
                let trigs = call.substring(call.indexOf('(') + 1).split(',')
                for (let i = 0; i < trigs.length; i++) {
                    const trig = trigs[i].trim();
                    if (!validateStr(trig)) continue;
                    setListener(element, trig, function (event) { window[func](event) })
                }
            }
        }

    },

        registerFunc = function (name, func) {
            if (typeof name != "string" || (func != null && typeof func != "function")) throw new Error("illegal argument(s)")
            let linkedFunction = linkedFunctions[name]
            if (linkedFunction == null) return false;
            linkedFunction["function"] = func;
            return true;
        },

        getLinkedFunctions = () => {
            let functionNames = [];
            for (let func in linkedFunctions) {
                functionNames.push(func)
            }
            return functionNames;
        },

        getLinkedElements = function (name) {
            if (validateStr(name)) {
                let func =
                    linkedFunctions[name]
                if (func == null) return null;
                return func["children"].splice(0, 0);
            } else { return null; }
        },
        getPadding = function (el, pa = document.body) {
            if (!(el instanceof HTMLElement) || !(pa instanceof HTMLElement)) throw new Error("illegal argument(s)")
            $el = $(el)
            $pa = $(pa)
            return new padding($el.offset().top - $pa.offset().top, $pa.offset().left + pa.clientWidth - el.offsetWidth - $el.offset().left, $pa.offset().top + pa.clientHeight - $el.offset().top - el.offsetHeight, $el.offset().left - $pa.offset().left);

        }

    let
        validateStr = function (str) {
            if (!(typeof str == "string") || str == "") return false;
            str = str.trim();
            for (let ind = 0; ind < str.length; ind++) {
                const ch = str.charCodeAt(ind);
                if ((ch < 48 || ch > 57) && (ch < 64 || ch > 90) && (ch < 96 || ch > 132) && (ch != '_'.charCodeAt(0) && (ch != '$'.charCodeAt(0)))) return false;
            }
            return true;
        },

        getNames = function (str) {
            if (!(typeof str == "string") || str == "") return [];
            let names = str.trim().split(' ')
            names.filter(function (ind, name) { return validateStr(name) });
            return names;
        },

        setListener = function (element, handlerName, callBack) {
            //can register custom event listeners
            check: switch (handlerName) {
                case parentScroll: {
                    $(element.parentElement).on("scroll", callBack);
                    break
                }
                case isIn: {
                    for (let ind = 0; ind < inOutHandlerData.length; ind++) {
                        const entry = inOutHandlerData[ind];
                        if (entry.element == element) {
                            entry.inCallback = callBack;
                            break check;
                        }

                    }
                    inOutHandlerData.push({ "element": element, state: unset, "inCallback": callBack, "outCallback": null });
                    break
                }

                case isOut: {
                    for (let ind = 0; ind < inOutHandlerData.length; ind++) {
                        const entry = inOutHandlerData[ind];
                        if (entry.element == element) {
                            entry.outCallback = callBack;
                            break check;
                        }

                    }
                    inOutHandlerData.push({ "element": element, state: unset, "outCallback": callBack, "inCallback": null });
                    break
                }
                case"hover":{
                    $(element).on("mouseenter", callBack);
                    break;
                }
                default: {
                    $(element).on(handlerName, callBack);
                }
            }
        },
        startListening = function () {
            listenerLoop();
        }
        , listenerLoop = function () {
            for (let ind = 0; ind < inOutHandlerData.length; ind++) {
                let element = inOutHandlerData[ind]["element"];
                let $element = $(element)

                //Listening for scroll events "could be modified"
                let state = inOutHandlerData[ind]["state"];
        
                if (window.getComputedStyle(document.documentElement).display.indexOf("none") == 0 || $element.offset().top < document.documentElement.scrollTop - 50 || $element.offset().top > document.documentElement.scrollTop + document.documentElement.clientHeight || $element.offset().left < document.documentElement.scrollLeft - 50 || $element.offset().left > document.documentElement.scrollLeft + document.documentElement.clientWidth) {
                    if (state == isIn || state == unset) {
                        let event = {};
                        {
                            event.currentTarget = element;
                            event.target = element;
                            event.type = "out"
                            event.isTrusted = false
                            event.bubbles = false
                            event.cancelable = true
                        }

                        inOutHandlerData[ind]["state"] = isOut;
                        element.state = "out"
                        if (inOutHandlerData[ind]["outCallback"] != null) try {
                            inOutHandlerData[ind]["outCallback"](event);
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }
                else if (state == isOut || state == unset) {
                    let event = {};
                    {
                        event.currentTarget = element;
                        event.target = element;
                        event.type = "in"
                        event.isTrusted = false
                        event.bubbles = false
                        event.cancelable = true
                    }


                    inOutHandlerData[ind]["state"] = isIn;
                    element.state = "in"
                    if (inOutHandlerData[ind]["inCallback"] != null) try {
                        inOutHandlerData[ind]["inCallback"](event);
                    } catch (error) {
                        console.error(error)
                    }
                }

            } setTimeout(listenerLoop, listenerRefresh);
        },
        getScrollElement = function (element) {
            let props = window.getComputedStyle(element.parentElement);
            while (element.parentElement != null && props.overflow.indexOf("auto") == -1 && props.overflow.indexOf("scroll") == -1) {
                element = element.parentElement;
                props = window.getComputedStyle(element.parentElement);
            }
            return element;
        }
}


class padding {

    constructor(top, right, bottom, left) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
}