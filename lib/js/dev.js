{
    let TONES=[["#555555"],["red","green","blue"],["#555555","#dd7777","77dd77","dddd77"]]
    var outline = function (root,tone=0) {
        if (!(root instanceof HTMLElement)) {
            root = window.$0;
        }
        if (!(root instanceof HTMLElement)) {
            console.log("document root?")
            root = document.documentElement
        }
        if(!(tone>=0&&tone<TONES.length)){
            tone=0;
        }
        if (root.getAttribute("yt-dev-outlined") == null) {
           let lib = TONES[tone]
            recurseOutline(root, 0,lib)
        } else {
            recurseRemoveOutline(root)
        }
    }, edit = function (root) {
        if (!(root instanceof HTMLElement)) {
            root = document.documentElement
        }
        if (root.contentEditable=="true") root.contentEditable = false; else {
            root.contentEditable = true
        }

    }

    let recurseOutline = function (root, colInd,lib) {
        if (colInd >= lib.length) colInd = 0;
        markOutline(root, lib[colInd])
        for (let ind = 0; ind < root.children.length; ind++) {
            const element = root.children[ind];
            recurseOutline(element, colInd + 1,lib)
        }
    },
        recurseRemoveOutline = function (root) {
            removeOutline(root)
            for (let ind = 0; ind < root.children.length; ind++) {
                const element = root.children[ind];
                recurseRemoveOutline(element)
            }
        }
    markOutline = function (el, color) {
        let styles = window.getComputedStyle(el)
        if (el.getAttribute("yt-dev-outlined") != null) return;
        if (styles.outline != null && styles.outline != "") {
            el.outlineValue = styles.outline;
        } el.setAttribute("yt-dev-outlined", "true")
        el.style.outline = "dashed " + color + " 3px"
        el.style.outlineOffset = "-1.5px"
    },
        removeOutline = function (el) {
            if (el.getAttribute("yt-dev-outlined") == null) return;
            let styles = window.getComputedStyle(el)
            if (el.outlineValue == null || el.outlineValue == "") {
                el.style.outline = "none";
            } else {
                el.style.outline = el.outlineValue;
            }
            el.outlineValue = null;
            el.removeAttribute("yt-dev-outlined")

        }
}