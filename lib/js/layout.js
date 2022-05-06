const LEFT = "left";
const RIGHT = "right"
const WITH = "with"
const MID = "mid"
const ABOVE = "above"
const BELOW = "below"
{
    /**This function aligns the provided element.
     * Syntax:  align(<element>, <x=null|number|[<rel>?,<from>?,<noClip>?,<...offsets>?]?, <y~<x>>?, <duration>?, <easing>?)
     *  Note: it sets the elements position to fixed.
     * 
    */
    var
        align = function (el, x, y, duration = 300, easing = "easeOutQuad") {
            if (!(el instanceof HTMLElement) || !(duration >= 0)) throw new Error("illegal argument(s)")
            if (el.style.display != "block" && el.style.display != "inline-block") el.style.display = "block";
            x = computeX(x, el);
            y = computeY(y, el);
            el.style.position = "fixed";
            if (el.style.display != "block" && el.style.display != "inline-block") el.style.display = "block";
            return place(x, y, el, duration, easing);
        },

        /** Translates the provided element to the indicated absolute position
         * Syntax:  similar to 'align()'
        */
        translateTo = function (el, x, y, duration = 300, easing = "easeOutQuad", useSystem) {
            if (!(el instanceof HTMLElement) || !(duration >= 0)) throw new Error("illegal argument(s)")
            x = computeX(x, el);
            y = computeY(y, el);
            let currentOffset = $(el).offset()
            let dx = x - currentOffset.left;
            let dy = y - currentOffset.top;

            if(useSystem||duration==0){
                let durationBackup
                el.style.transform+=" translate("+dx+"px, "+dy+"px)"
            }
            let anim = anime({ duration: duration, translateX: "+=" + dx + "px", translateY: "+=" + dy + "px", targets: el, easing: easing });
            return anim;
        },

        /**Copy absolute dimensions from the source element to the dest.*/
        copyDimensions = function (source, dest, duration = 0) {
            let comStyle = window.getComputedStyle(source);
            if (duration == 0) {
                dest.style.boxSizing = comStyle.boxSizing; //TODO: fix
                dest.style.borderBottomWidth = comStyle.borderBottomWidth;
                dest.style.borderTopWidth = comStyle.borderTopWidth;
                dest.style.borderRightWidth = comStyle.borderRightWidth;
                dest.style.borderLeftWidth = comStyle.borderLeftWidth;
                dest.style.height = comStyle.height;
                dest.style.width = comStyle.width;

                dest.style.padding = comStyle.padding;
                dest.style.margin = comStyle.margin;
                return;
            }
            let anim = anime({
                duration: duration,
                height: [comStyle.height],
                width: [comStyle.width],
                padding: [comStyle.padding],
                borderRightWidth: [comStyle.borderRightWidth],
                borderTopWidth: [comStyle.borderTopWidth],
                borderBottomWidth: [comStyle.borderBottomWidth],
                borderLeftWidth: [comStyle.borderLeftWidth],
                targets: dest, easing: "easeOutQuad"
            });
            return anim;
        }

    let
        computeX = function (x, el) {
            if (x == null) return 0;
            if (typeof x == "number") return;
            if (x.length == null) throw new Error("illegal argument(s)")
            if (x.length == 0) return 0;
            let ind = 0;
            let rel = "";
            let from;
            let attempts = 1;
            let noClip = -1;
            let translate = 0;
            let offset = 0;
            if (x[0] != null && typeof x[0] == "string") { rel = x[0].trim(); }
            if (rel != null && (rel == LEFT || rel == RIGHT || rel == WITH || rel == MID)) {
                ind++;
            }
            for (; ind < x.length; ind++) {
                const param = x[ind];
                if (param == null) continue;

                if (typeof param == "string") {
                    if (from != null) throw new Error("more than one element to relate to")
                    from = document.querySelector(param)
                } else if (param instanceof HTMLElement) {
                    if (from != null) throw new Error("more than one element to relate to")
                    from = param
                } else if (typeof param == "number") {
                    offset += param;
                } else if (typeof param == "boolean") {
                    if (noClip == -1) noClip = param; else if (attempts == 1) { attempts = 0 } else { throw new Error("Invalid clipping parameter for  x-axis") }

                } else { throw new Error("illegal argument(s)") }

            }

            while (attempts < 2) {
                if (from == null) break;
                switch (rel) {
                    case LEFT:
                        translate = $(from).offset().left - el.offsetWidth;
                        break;
                    case RIGHT:
                        translate = $(from).offset().left + from.offsetWidth;
                        break;
                    case MID:
                        translate = $(from).offset().left + from.offsetWidth / 2 - el.offsetWidth / 2;
                        break;
                    default:
                        translate = $(from).offset().left;
                }
                if (attempts == 0) {
                    if (translate + offset > window.innerWidth - el.offsetWidth || translate < 0) {
                        switch (rel) {
                            case LEFT:
                                rel = RIGHT
                                break;
                            case RIGHT:
                                rel = LEFT;
                                break;
                            default:
                                attempts++;
                        }
                    } else { attempts++; }
                }
                attempts++;
            }
            translate += offset;
            if (noClip) {
                if (translate > window.innerWidth - el.offsetWidth) translate = window.innerWidth - el.offsetWidth;
                if (translate < 0) translate = 0;
            }
            return translate;
        },

        computeY = function (y, el) {
            if (y == null) return 0;
            if (typeof y == "number") return y;
            if (y.length == null) throw new Error("illegal argument(s)")
            if (y.length == 0) return 0;
            let ind = 0;
            let rel = "";
            let noClip = -1;
            let from;
            let translate = 0;
            let offset = 0;
            let attempts = 1;
            if (y[0] != null && typeof y[0] == "string") { rel = y[0].trim(); }
            if (rel != null && (rel == ABOVE || rel == BELOW || rel == WITH || rel == MID)) {
                ind++;
            }
            for (; ind < y.length; ind++) {
                const param = y[ind];
                if (param == null) continue;

                if (typeof param == "string") {
                    if (from != null) throw new Error("more than one element to relate to")
                    from = document.querySelector(param)
                } else if (param instanceof HTMLElement) {
                    if (from != null) throw new Error("more than one element to relate to")
                    from = param
                } else if (typeof param == "number") {
                    offset += param;

                } else if (typeof param == "boolean") {
                    if (noClip == -1) noClip = param; else if (attempts == 1) { attempts = 0 } else { throw new Error("Invalid clipping parameter for  y-axis") }
                } else {
                    throw new Error("illegal argument(s)")
                }

            }
            while (attempts < 2) {
                if (from == null) break;
                switch (rel) {
                    case ABOVE:
                        translate = $(from).offset().top - el.offsetHeight;
                        break;
                    case BELOW:
                        translate = $(from).offset().top + from.offsetHeight;
                        break;
                    case MID:
                        translate = $(from).offset().top + from.offsetHeight / 2 - el.offsetHeight / 2;
                        break;
                    default:
                        translate = $(from).offset().top;
                }
                if (attempts == 0) {
                    if (translate + offset > window.innerWidth - el.offsetWidth || translate < 0) {
                        switch (rel) {
                            case ABOVE:
                                rel = BELOW;
                                break;
                            case BELOW:
                                rel = ABOVE;
                                break;
                            default:
                                attempts++;
                        }
                    } else { attempts++; }
                }
                attempts++;
            }
            translate += offset;
            if (noClip) {
                if (translate > window.innerHeight - el.offsetHeight) translate = window.innerHeight - el.offsetHeight;
                if (translate < 0) translate = 0;
            }
            return translate;
        }, place = function (left, top, el, duration = 300, easing = "easeOutQuad") {
            let anim = anime({ duration: duration, top: top, left: left, targets: el, easing: easing });
            return anim;
        }
}