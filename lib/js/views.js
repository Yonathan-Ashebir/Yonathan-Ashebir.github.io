{
    var renderViews = function () {
        setup()
        startLoop()
    },
        showDropMenu = function (menu, duration = -1, shift = -1) {
            if (!(menu instanceof HTMLElement) || (!$(menu).hasClass("yt-dropdown-menu"))) throw new Error("illegal argument(s)")
            let $menu = $(menu)
            let paX = paY = menu.parentElement

            {
                let _pa = document.querySelector($menu.attr("yt-reference"));
                if (_pa != null) paX = paY = _pa;
                let _paX = document.querySelector($menu.attr("yt-reference-x"));
                if (_paX != null) paX = _paX;
                let _paY = document.querySelector($menu.attr("yt-reference-y"));
                if (_paY != null) paY = _paY;
            }

            if (!(duration >= 0)) {
                duration = parseInt(menu.getAttribute("yt-duration"))
                if (!(duration >= 0)) duration = 500;
            }
            if (!(shift >= 0)) {
                shift = parseInt(menu.getAttribute("yt-shift"))
                if (!(shift >= 0)) shift = 60;
            }
            let items = menu.children;
            menu.style.overflow = "hidden"
            if ($menu.hasClass("bottom")) {
                if ($menu.hasClass("yt-from-left")) {
                    translateTo(menu, ["mid", paX, -shift, true, true], ["below", paY, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["mid", paX, true, true], ["below", paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateX: [-shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                } else if ($menu.hasClass("yt-form-right")) {
                    translateTo(menu, ["mid", paX, shift, true, true], ["below", paY, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["mid", paX, true, true], ["below", paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateX: [shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                } else {
                    translateTo(menu, ["mid", paX, true, true], ["below", paY, shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["mid", paX, true, true], ["below", paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateY: [shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }.complete = function () { menu.style.overflow = "visible" }
                }
            } else if ($menu.hasClass("right")) {
                if ($menu.hasClass("yt-form-top")) {
                    translateTo(menu, ["right", paX, true, true], ["below", paY, -shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["right", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateY: [shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                } else if ($menu.hasClass("yt-form-bottom")) {
                    translateTo(menu, ["right", paX, true, true], ["below", paY, shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["right", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateY: [-shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                }
                else {
                    translateTo(menu, ["right", paX, shift, true, true], [paY, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["right", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateX: [shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                }
            } else if ($menu.hasClass("left")) {
                if ($menu.hasClass("yt-form-top")) {
                    translateTo(menu, ["left", paX, true, true], ["below", paY, -shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["left", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateY: [shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                } else if ($menu.hasClass("yt-form-bottom")) {
                    translateTo(menu, ["left", paX, true, true], ["below", paY, shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["left", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateY: [-shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                } else {
                    translateTo(menu, ["left", paX, true, true], ["below", paY, -shift, true, true], 0, "linear", true); setTimeout(function () { translateTo(menu, ["left", paX, true, true], [paY, true, true], duration, "easeOutQuad", true) }, 10);
                    anime({ targets: items, translateX: [-shift, 0], duration: duration, easing: "easeOutQuad", delay: anime.stagger(duration / items.length) }).complete = function () { menu.style.overflow = "visible" }
                }
            }
            $menu.addClass("show")
        },
        hideDropMenu = function (menu, duration = -1, shift = -1) {
            if (!(menu instanceof HTMLElement) || (!$(menu).hasClass("yt-dropdown-menu"))) throw new Error("illegal argument(s)")
            let $menu = $(menu)
            if (!(duration >= 0)) {
                duration = parseInt(menu.getAttribute("yt-duration"))
                if (!(duration >= 0)) duration = 500;
            }
            if (!(shift >= 0)) {
                shift = parseInt(menu.getAttribute("yt-shift"))
                if (!(shift >= 0)) shift = 60;
            }
            if ($menu.hasClass("bottom")) {
                if ($menu.hasClass("yt-from-left")) {
                    translateTo(menu, [menu, -shift], [menu], duration, "easeInQuad", true)

                } else if ($menu.hasClass("yt-form-right")) {
                    translateTo(menu, [menu, shift], [menu], duration, "easeInQuad", true)

                } else {
                    translateTo(menu, [menu], [menu, shift], duration, "easeInQuad", true)
                }
            } else if ($menu.hasClass("right")) {
                if ($menu.hasClass("yt-form-top")) {
                    translateTo(menu, [menu], [menu, -shift], duration, "easeInQuad", true)


                } else if ($menu.hasClass("yt-form-bottom")) {
                    translateTo(menu, [menu], [menu, shift], duration, "easeInQuad", true)

                }
                else {
                    translateTo(menu, [menu, shift], [menu], duration, "easeInQuad", true)

                }
            } else if ($menu.hasClass("left")) {
                if ($menu.hasClass("yt-form-top")) {
                    translateTo(menu, [menu], [menu, -shift], duration, "easeInQuad", true)

                } else if ($menu.hasClass("yt-form-bottom")) {
                    translateTo(menu, [menu], [menu, shift], duration, "easeInQuad", true)

                } else {
                    translateTo(menu, [menu, -shift], [menu], duration, "easeInQuad", true)

                }
            }
            $menu.removeClass("show")


        },
        toggleDrop = function (event) {
            let tar = document.querySelector(event.currentTarget.getAttribute("yt-target"));
            if (window.getComputedStyle(tar.parentElement).getPropertyValue("--pointer-state").trim() != "hover") {
                hideDropMenu(tar)
            } else {
                showDropMenu(tar)
            }
        }
    hideDrop = function (event) {
        let tar = document.querySelector(event.currentTarget.getAttribute("yt-target"));
        hideDropMenu(tar)
    },
        showDrop = function (event) {
            let tar = document.querySelector(event.currentTarget.getAttribute("yt-target"));
            showDropMenu(tar)
        }
    let
        setup = function () {

        }


}