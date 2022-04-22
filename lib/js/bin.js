var selectedTab, tabTransition = 300;
class Row {
    min = 0;
    max = 0;
    elements = [];

    evalLimits() {
        if (this.min > this.max) { this.min = 0; this.max = 0; }
        if (this.elements.length == 0) throw new Error("no elements yet")
        for (let ind = 0; ind < this.elements.length; ind++) {
            let element = this.elements[ind];
            let off = element.offsetTop;
            if (off < this.min) this.min = off; else if (off > this.max) { this.max = off };
        }
    }
    getVariance(el) {
        this.evalLimits();
        let off = el.offsetTop;
        if (off <= this.min) return off - this.min; else if (off > this.max) return off - this.max; else return 0;
    }

    constructor(elements) {
        this.elements = elements;
        this.evalLimits();
    }
}
/** lists rows through relative incomplete algorithm */
function getRows(parent, dif = 2) {
    let children = parent.children;
    let rows = [];
    for (let ind = 0; ind < children.length; ind++) {
        let child = children[ind];
        if (areEqual(child.style.display, "none", true)) continue;
        let top = child.offsetTop;
        if (rows.length == 0) { rows.push(new Row([child])); continue }
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let variance = row.getVariance(child);
            if (Math.abs(variance) <= dif) { row.elements.push(child); break; }
            if (variance < 0) { rows.splice(i, 0, new Row([child])); break; } else if (i == rows.length - 1) { rows.push(new Row([child])); break }
        }
    }
    return rows;
}
/** Hides rows (sets display to none) below and including the specified number */
function hideRowsBelow(parent, st = 1, dif = 2) {
    let rows = getRows(parent, dif);
    if (st >= rows.length) return;
    for (let ind = st; ind < rows.length; ind++) {
        console.log(rows.toString())
        rows[ind].elements.forEach(element => {
            element.style.display = "none"
        });
    }
}
{
    var p = new Promise((resolve, reject) => setTimeout(() => { console.log("firstP"); }, 2000));
    p.then(null, () => console.log("ok caugth")).then(() => { console.log("then 1"); while (true) { } });
    p.then(null, () => console.log("ok caugth")).then(() => console.log("then 2"));
    setTimeout(() => console.log("end"), 3000);
    .then(() => { console.log("resolved1"); }, () => { console.log("rejected 1"); return new Promise((resolve, reject) => setTimeout(() => { console.log("secondP"); resolve('foo') })) }).then(() => { console.log("resolved2") }, () => console.log("rejected2")).catch(() => console.log("caught"));
    console.log(lastP.state)
}
function copySiblingOffset(source = document.body, dest = document.body, duration = 300) {//With in the same parent. Margin not considered
    if (source.parentElement != dest.parentElement) throw new Error("method is only made for siblings")
    dest.style.boxSizing = "absolute";
    if (duration == 0) {
        dest.style.top = source.offsetTop;
        dest.style.left = source.offsetTop;
        return null;
    }

    let anim = anime({ duration: duration, height: [dest.style.height, parseInt(source.offsetHeight)], width: [dest.style.width, parseInt(source.offsetWidth)], top: [dest.style.top, parseInt(source.offsetTop)], left: [dest.offsetLeft, parseInt(source.offsetLeft)], targets: dest, easing: "easeOutQuad" });
    return anim;
}
function showDropdownMenu(tab) {
    let dropMenu = tab.querySelector(".drop-menu");
    if (dropMenu != null) {
        dropMenu.display = "block";
        let offset = $(dropMenu).offset();
        let toParentalLeft = dropMenu.offsetLeft - $(dropMenu).offset().left
        let pos = new DOMRect(); pos.width = dropMenu.offsetWidth; pos.height = dropMenu.offsetHeight; pos.left = $(tab).offset().left + tab.clientWidth / 2 - dropMenu.clientWidth; pos.top = 0;
        fixPos(pos)
        { dropMenu.style.height = pos.height; dropMenu.style.width = pos.width; dropMenu.style.left = pos.left + toParentalLeft }
        if (!dropMenu.classList.contains("active")) dropMenu.classList.add("active");
        let anim = anime({ duration: 300, borderWidth: { value: "20px", targets: tab }, opacity: { value: 1, targets: dropMenu }, complete: () => { selecting = false; previousTab = tab } })

    } else { previousTab = tab; selecting = false; }

}

let dropMenu = tab.querySelector(".film-menu");
yes: if (dropMenu != null) {
    let film = document.getElementById("fullScreenMenu");
    if (film == null) break yes;
    film.appendChild(dropMenu);

    dropMenu.style.display = "block";
    let offset = $(tab).offset();
    translateTo(offset.left + tab.clientWidth / 2 - dropMenu.clientWidth / 2, offset.top + tab.clientHeight, dropMenu, 0)
    anime({ duration: tabTransition, borderWidth: { value: "20px", targets: tab }, opacity: { value: 1, targets: dropMenu } })
    let anim = anime({ targets: dropMenu.children, opacity: [0.3, 1], translateY: ["-30%", 0], duration: tabTransition, delay: anime.stagger(100), easing: "easeOutQuad", complete: () => { selecting = false; previousTab = tab } })

    return;
}
previousTab = tab; selecting = false;



< !doctype html >
    <html lang="en">

        <head>
            <!-- Required meta tags -->
    <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                <!-- CSS -->
    <link rel="stylesheet" href="./lib/bootstrap-5.0.2-dist/css/bootstrap-.css" />
                <link rel="stylesheet" href="./lib/css/onsen-css-components.min.css" />
                <link rel="stylesheet" href="./lib/css/onsenui.min.css" />
                <link rel="stylesheet" href="./lib/css/font_awesome/css/font-awesome.min.css" />
                <link rel="stylesheet" href="./lib/css/ionicons/css/ionicons.min.css" />
                <link rel="stylesheet" href="./lib/css/material-icons/material-icons.css" />
                <link rel="stylesheet" href="./lib/css/custom.css" />

                <!--JS-->
    <!-- <script src="./lib/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script> -->
    <script src="./lib/js/anime.js"></script>
                <script src="./lib/js/custom.js"></script>
                <script src="./lib/js/jquery-3.6.0.js"></script>
                <script src="./lib/js/linker.js"></script>
                <script src="./lib/js/layout.js"></script>

                <script>
                    var navList;
        window.onload = function () {
                        navList = document.getElementById("navList");
        };
        function test() {
                        navList.className = "navbar-collapse";
        }
    </script>

                <style testNode>
                    :root {
                        --nav - background: ;
            --nav-primary: ;
            --nav-on-primary: var(--nav-secondary);
            --nav-secondary: #0d6efd;
            --nav-on-secondary: #fff;
            --tab-outline: var(--nav-on-secondary);
            --tab-transition: 0.3s;
        }




        .nav {
                        width: 100%;
            padding: 0 10px;
            overflow-y: hidden;
            transition: "height"300 linear;
            z-index: ;
            background: transparent;
        }

        .nav-row {
                        overflow - x: hidden;
        }

        .nav-item {
                        z - index: 1;
            display: inline-block;
        }



        .nav-pills:hover>#tab-selector,
        .nav-pills:active>#tab-selector {
                        opacity: 1;
        }


        .list-menu {
                        opacity: 0;
            pointer-events: none;
            transition: --tab-transition ease-out;
        }

        .list-menu>.list-item {
                        transition: --tab-transition ease-out;
        }



        .nav-pills:hover>.nav-item.active>.list-menu.show,
        .list-menu.show:hover {
                        pointer - events: all;
            opacity: 1;
            display: block;
        }


        .nav-pills>.nav-item>.nav-link {
                        transition: color var(--tab-transition) ease-out;

        }

        .nav-pills>.nav-item {
                        transition: color var(--tab-transition) ease-out;
            color: var(--nav-on-primary);
            z-index: 1;
        }

        .nav-pills>.nav-item>.nav-link {
                        background - color: none;
        }


        .nav-pills:hover>.nav-item.active>.nav-link {
                        color: var(--nav-on-secondary);
        }

        .nav-pills>.nav-item.active {
                        color: var(--nav-on-secondary);
            z-index: 2;
        }





        .film {
                        position: absolute;
            background: none;
            width: 100%;
            height: 100%;
            z-index: 1;
            top: 0;
            left: 0;
        }

        .offsetUp {
                        transform: translate(0, -60%);
            opacity: 0;
            transition: 0s;
        }
    </style>
                <style>
                    #root {
                        left: 50%;
            position: fixed;
            padding: 0;
            min-height: 500px;
            margin: 0;
            width: 100%;
            max-width: 100%;
            min-width: 400px;
            transform: translate(-50%, 0);
        }

        header {
                        width: 100%;
            height: 10vh;
            background-color: #555555;
            color: white;

        }


        #tab-selector {
                        position: absolute;
            background-color: var(--nav-secondary);
            pointer-events: none;
            opacity: 0;
            z-index: 0;
        }

        .fullscreen-selector {
                        background - color: var(--nav-secondary);
            z-index: 0;

            pointer-events: none;
        }

        #nav-cage {
                        display: block;
            width: 500px;
            min-width: 500px;
            overflow: hidden;
        }

        #title-place {
                        width: 120px;
            height: 90px;
            margin: 10% auto 5%;
            column-count: 1;
        }

        #menu-place {
                        width: 80%;
            min-height: 100px;
            margin: 10px auto 10px;
            border: none;
        }

        #icon-place {
                        width: 40px;
            height: 40px;
            margin: 0 auto 10px;
        }

        #text-place {
                        width: 100%;
            height: 40px;
        }

        #main {
                        display: block;
            z-index: 0;
            width: 100%;
            height: 100%;
            filter: brightness(100%) blur(0);
            transition:--tab-transition linear;
            pointer-events: all;
        }
        #main.blurred{
                        filter: brightness(100%) blur(0);
             pointer-events: none;
        }



        #menuPlace>.dropdown-menu { }
                </style>
</head>


            <body>
                <div id="root">

                    <div id="main">
                        <header>
                            test
            </header>
                        <nav class="navbar navbar-expand-md navbar-light bg-light">

                            <!-- <button class="navbar-toggler end-0" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button> -->
                <div id="nav-cage">
                                <ul id="nav" class="nav-pills nav">

                                    <li link-trig="click mouseover" link-func="highlightTab" class="nav-item ">
                                        <button data-bs-toggle="tab" class="nav-link" id="homeTab" href="#"
                                            aria-current="page">Home</button>
                                    </li>
                                    <li link-trig="click mouseover" link-func="highlightTab" class="nav-item">
                                        <button data-bs-toggle="tab" class="nav-link" href="#">About Us</button>


                                        <ul style="position: fixed;" class="list-menu dropdown-menu">
                                            <li class="list-item dropdown-item">one</li>
                                            <li class="list-item dropdown-item">two</li>
                                            <li class="list-item dropdown-item">three</li>
                                        </ul>

                                    </li>
                                    <li link-trig="click mouseover" link-func="highlightTab" class="nav-item">
                                        <button data-bs-toggle="tab" class="nav-link " href="#">Services</button>
                                    </li>
                                    <li link-trig="click mouseover" link-func="highlightTab" class="nav-item">
                                        <button data-bs-toggle="tab" class="nav-link" href="#">Open Vocations</button>
                                    </li>
                                    <li link-trig="click mouseover" link-func="highlightTab" class="nav-item">
                                        <button data-bs-toggle="tab" class="nav-link" href="#">Actions</button>
                                        <ul style="position: fixed;" class="list-menu dropdown-menu">
                                            <li class="list-item dropdown-item">one</li>
                                            <li class="list-item dropdown-item">two</li>
                                            <li class="list-item dropdown-item">three</li>
                                        </ul>
                                    </li>
                                    <div id="tab-selector" class="selector nav-link"></div>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div id="fullscreen-menu" class="film" style="opacity:0;display: none;">

                        <div id="title-place" class="nav-pills">
                            <div id="icon-place"></div>
                            <div id="text-place"></div>
                        </div>
                        <div id="menu-place">

                        </div>
                    </div>
                </div>
                <script>
                    var mainLoop;
        $(document).ready(function () {
                        setupNav()
            async()
            window.onresize = screenChanged;
        })
        function async() {
                        mainLoop = setInterval(function () {

                        }, 800)
                    }
        /** */
        function fixPos(rect, frame = window) {
            if (rect == null) throw new Error("null argument(s)")

            let top = (rect.top) ? rect.top : (rect.bottom) ? frame.height - rect.bottom - rect.height : 0;
            let left = (rect.left) ? rect.left : (rect.right) ? frame.width - rect.right - rect.width : 0;
            let maxLeft = ((frame == window) ? window.innerWidth : frame.width) - rect.width;
            let maxTop = ((frame == window) ? window.innerHeight : frame.height) - rect.height;
            if (maxLeft < 0) {rect.width = frame.width; maxLeft = 0; }
            if (maxTop < 0) {rect.height = frame, height; maxTop = 0; }
            if (top > maxTop) rect.top = maxTop;
            if (left > maxLeft) rect.left = maxLeft;
        }
        function screenChanged() {

            try {
                if (window.innerWidth >= 500) {
                        menuType = 0;
                } else {
                        menuType = 1;
                    $("tab-selector").show()
                }
                let tabs = document.querySelectorAll(".nav-pills>.nav-item")
                for (let ind = 0; ind < tabs.length; {
                    const tab = tabs[ind];
                    hideDropdownMenu(tab, 0)
                }


            } catch (error) {
                        console.log(error)
                    }
            console.log("screen setup done")

        }

        function setupNav() {
                        registerFunc("highlightTab", function (event, allTabs) {
                            if (!$(event.target).hasClass("nav-link")) return;
                            let others = [];
                            for (let ind = 0; ind < allTabs.length; ind++) {
                                const tab = allTabs[ind];
                                if (tab != event.currentTarget) {
                                    others.push(tab)
                                    hideDropdownMenu(tab, tabTransition)
                                }

                            }

                            if (menuType == 0) {
                                let selector = document.getElementById("tab-selector")
                                $(selector).fadeIn().show()
                                let offset = $(event.currentTarget).offset();
                                $(others).removeClass("active")
                                $(event.currentTarget).addClass("active")
                                event.currentTarget.querySelector(".list-menu")
                                copyDimensions(event.currentTarget, selector, tabTransition);
                                translateTo(selector, [event.currentTarget, false], [event.currentTarget, false], tabTransition).complete = function () {
                                    toggleDropdownMenu(event.currentTarget, tabTransition, event);
                                }

                            } else {
                                showFullScreenMenu(event.currentTarget, tabTransition)
                            }
                        })
                    }




        function copyAbsoluteLayout(source, dest, duration = 300) {
            //Margin not considered

            if (duration == 0) {
                        dest.style.boxSizing = source.style.boxSizing;

                dest.style.height = source.offsetHeight;
                dest.style.width = source.offsetWidth;
                dest.style.top = source.offsetTop;
                dest.style.left = source.offsetTop;
                return null;
            }

            let anim = anime({duration: duration, height: [dest.style.height, parseInt(source.offsetHeight)], width: [dest.style.width, parseInt(source.offsetWidth)], top: [dest.style.top, parseInt(source.offsetTop)], left: [dest.offsetLeft, parseInt(source.offsetLeft)], targets: dest, easing: "easeOutQuad" });
            return anim;
        }

        var menuType = 0, selecting = false, previousTab = null, tabTransition = 300;

        {
                        let titlePlace, menuPlace, selector, textPlace, iconPlace;

            var showFullScreenMenu = function (tab, duration) {
                //Get things ready
                if (!(tab instanceof HTMLElement)) return false;
                let menu = tab.querySelector(".nav-item>.list-menu")
                if (menu == null) return false;
                let title = tab.querySelector(".nav-link")
                if (selector == null) {
                        titlePlace = document.getElementById("title-place")
                    menuPlace = document.getElementById("menu-place")
                    textPlace = document.getElementById("text-place")
                    iconPlace = document.getElementById("icon-place")
                }
                $("#fullscreen-menu").css("display", "block")


                //Do all the necessary clones
                selector = $(title).clone(true, true);
                selector.addClass(".fullscreen-selector")
                selector = selector.get()[0]
                titlePlace.appendChild(selector)
                translateTo(selector, [tab], [tab], 0)
                tab.style.opacity = 0;


                // Start translating the selector
                anime({targets: $("#fullscreen-menu").get()[0], opacity: [0, 1], duration: tabTransition / 2 });
                anime({targets: $("#main").get()[0], filter: ['blur( 0px ) brightness(100%)', 'blur( 4px ) brightness(80%)'], duration: tabTransition / 2 })
                translateTo(selector, ["mid", textPlace], ["mid", textPlace], tabTransition)
                    .complete = function () {
                        $(menuPlace.children).remove();
                        let items = $(menu.children).clone(true);
                        let _items = items.get();
                        $(menuPlace).append(items)
                        items.css("opacity", 0)
                        for (let ind = 0; ind < _items.length; {
                            const item = _items[ind];
                            item.onclick = function () {hideFullScreenMenu(tab, duration)}
                        }

                        anime({targets: _items, opacity: [0.3, 1], translateY: ["-60%", 0], duration: duration, delay: anime.stagger(duration / _items.length), easing: "easeOutQuad" });

                    };
            }



            hideFullScreenMenu = function (tab, duration = 300) {
                if (selector == null) {
                        selector = document.createElement("div")
                    titlePlace = document.getElementById("title-place")
                    menuPlace = document.getElementById("menu-place")
                    textPlace = document.getElementById("text-place")
                    iconPlace = document.getElementById("icon-place")
                }
                translateTo(selector, [tab], [tab], tabTransition).complete = function () {
                        tab.style.opacity = 1;
                    anime({targets: $("#main").get()[0], filter: ['blur( 4px ) brightness(80%)', 'blur( 0px ) brightness(100%)'], duration: tabTransition })
                    setTimeout(function () {
                        $("#fullscreen-menu").css("display", "none")
                        selector.remove();
                    },300);
                }

            }
        }
        function hideDropdownMenu(host, duration = 300) {

            try {
                if (!(host instanceof HTMLElement) || typeof duration != "number" || duration < 0) return false;
                let menu = host.querySelector(".list-menu")
                if (menu == null) return false;
                if (!$(menu).hasClass("show")) return true;
                let items = $(menu).children();
                items = items.filter(function (ind, item) {
                    return $(item).hasClass("list-item")
                })
                anime({targets: items, opacity: [1, 0.3], translateY: [0, "-60%"], duration: duration, delay: anime.stagger(duration / items.get().length), easing: "easeOutQuad" })
                $(menu).slideUp(duration, function () {$(menu).hide().removeClass("show")});
                return true;
            } catch (error) {
                        console.log(error)

                return false;
            }

        }
        function toggleDropdownMenu(host, duration = 300, event) {
            if (!(host instanceof HTMLElement) || event == null) return false;
            let menu = host.querySelector(".list-menu")
            if (menu == null) return false;
            if (!$(menu).hasClass("show")) showDropdownMenu(host, duration);
            else if (event.type == "click") hideDropdownMenu(host, duration);
            else { return false; }
            return true;
        }


        function showDropdownMenu(host, duration = 3000, autoHide = true, x = ["mid", host], y = ["below", host]) {
            try {

                if (!(host instanceof HTMLElement)) return false;
                let menu = host.querySelector(".list-menu")
                if (menu == null) return false;
                if ($(menu).hasClass("show")) return true;
                let items = $(menu).children();
                items = items.filter(function (ind, item) {
                    return $(item).hasClass("list-item")
                })
                if (autoHide) {
                        $(items).off("click").click(function (event) { hideDropdownMenu(host, duration); })
                        // $(host).off("mouseleave").mouseleave(function (event) {if(event.target==event.currentTarget)hideDropdownMenu(host, duration); })
                    };

                $(menu).addClass("show")
                align(menu, x, y, 0)
                    .complete = function () {

                        $(menu).slideDown(duration)
                        anime({targets: items.get(), opacity: [0.3, 1], translateY: ["-60%", 0], duration: duration, delay: anime.stagger(duration / items.get().length), easing: "easeOutQuad" });

                    }

                return true;
            } catch (error) {
                        console.log(error)
                return false;
            }
        }


    </script>
            </body>


</html>
        <!doctype html>
<html lang="en">

            <head>
                <!-- Required meta tags -->
    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                    <!-- CSS -->
    <link rel="stylesheet" href="./lib/bootstrap-5.0.2-dist/css/bootstrap-.css" />
                    <link rel="stylesheet" href="./lib/css/onsen-css-components.min.css" />
                    <link rel="stylesheet" href="./lib/css/onsenui.min.css" />
                    <link rel="stylesheet" href="./lib/css/font_awesome/css/font-awesome.min.css" />
                    <link rel="stylesheet" href="./lib/css/ionicons/css/ionicons.min.css" />
                    <link rel="stylesheet" href="./lib/css/material-icons/material-icons.css" />
                    <link rel="stylesheet" href="./lib/css/custom.css" />

                    <!--JS-->
    <!-- <script src="./lib/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script> -->
    <script src="./lib/js/anime.js"></script>
                    <script src="./lib/js/custom.js"></script>
                    <script src="./lib/js/jquery-3.6.0.js"></script>
                    <script src="./lib/js/linker.js"></script>
                    <script src="./lib/js/layout.js"></script>

                    <script>
                        var navList;
        window.onload = function () {
                            navList = document.getElementById("navList");
        };
        function test() {
                            navList.className = "navbar-collapse";
        }
    </script>

                    <style testNode>
                        :root {
                            --nav - background: ;
            --nav-primary: #fff;
            ;
            --nav-on-primary: var(--nav-secondary);
            --nav-secondary: #0d6efd;
            --nav-on-secondary: #fff;
            --tab-outline: var(--nav-on-secondary);
            --tab-transition: 0.3s;
        }




        .nav {
                            width: 100%;
            padding: 0 10px;
            overflow-y: hidden;
            transition: "height"300 linear;
            z-index: ;
            background: transparent;
        }

        .nav-row {
                            overflow - x: hidden;
        }

        .nav-item {
                            z - index: 1;
            display: inline-block;
        }



        .nav-pills:hover>#tab-selector,
        .nav-pills:active>#tab-selector {
                            opacity: 1;
        }


        .list-menu {
                            opacity: 0;
            pointer-events: none;
            transition: all var(--tab-transition) ease-out;
            overflow: hidden;
        }

        .list-menu>.list-item {
                            transition: var(--tab-transition) ease-out;
        }



        .nav-pills:hover>.nav-item.active>.list-menu.show,
        .list-menu.show {
                            pointer - events: all;
            opacity: 1;
            display: block;
        }


        #nav.nav-pills>.nav-item>.nav-link {
                            transition: color var(--tab-transition) ease-out;

        }

        #nav.nav-pills>.nav-item {
                            transition: background var(--tab-transition) ease-out;
            color: var(--nav-on-primary);
            z-index: 1;
        }

        #nav.nav-pills:not(.fullscreen)>.nav-item>.nav-link {
                            background - color: none;
        }

        #nav.nav-pills:not(.fullscreen)>.nav-item.active {
                            z - index: 2;
        }

        #nav.nav-pills:not(.fullscreen):hover>.nav-item.active>.nav-link {
                            color: var(--nav-on-secondary);

        }


        #nav.nav-pills.fullscreen>.nav-item>.nav-link:hover {
                            color: var(--nav-on-secondary);
            background-color: var(--nav-secondary);
        }


        .yt-film {
                            position: absolute;
            background: none;
            width: 100%;
            height: 100%;
            z-index: 1;
            top: 0;
            left: 0;
            opacity: 0;
            pointer-events: none;
        }

        .yt-film.yt-active {
                            opacity: 1;
            pointer-events: all;
            background: #00000088;
        }

        .yt-offsetUp {
                            transform: translate(0, -60%);
            opacity: 0;
        }

        .yt-blurred {
                            filter: blur(2px);
            pointer-events: none;
        }

        .yt-collapsed {
                            height: 0px;
        }
    </style>
                    <style>
                        #root {
                            left: 50%;
            position: fixed;
            padding: 0;
            min-height: 500px;
            margin: 0;
            width: 100%;
            max-width: 100%;
            min-width: 400px;
            transform: translate(-50%, 0);
        }

        header {
                            width: 100%;
            height: 10vh;
            background-color: #555555;
            color: white;

        }


        #tab-selector {
                            position: absolute;
            background-color: var(--nav-secondary);
            pointer-events: none;
            opacity: 0;
            z-index: 0;
        }

        #fullscreen-menu {
                            transition: var(--tab-transition) ease-out;
        }



        #title-place {
                            width: 100%;
            height: 90px;
            margin: 10% auto 5%;
            column-count: 1;
        }

        #menu-place {
                            width: 80%;
            min-height: 100px;
            margin: 10px auto 10px;
            border: none;
        }

        #icon-place {
                            width: 40px;
            height: 40px;
            margin: 0 auto 10px;
        }

        #text-place {
                            width: 100%;
            height: 40px;
        }

        #main {
                            display: block;
            z-index: 0;
            width: 100%;
            height: 100%;
            transition: var(--tab-transition) linear;
            /* pointer-events: all; filter: brightness(100%) blur(0); */
        }

        #close-menu {
                            transition: var(--tab-transition) linear;
            float: right;
            margin: 20px;
            padding: 13px;
            border-radius: 50%;
            background-color: var(--nav-primary);
        }


        .btn-scroll:hover,
        #close-menu:hover {
                            transform: scale(0.9) rotateY(-12deg);
        }




        .btn-scroll {
                            display: inline-block;
            box-sizing: border-box;
            width: 40px;
            height: 40px;
            text-align: center;
            font-size: 0.5rem;
            padding: calc((40px - 0.5rem)/2);
            text-decoration: none;
            margin: calc(100% - 40px)/2 0;
            overflow: hidden;
        }


        .btn-scroll:hover,
        #close-menu:active {
                            transition - duration: 100ms;
            transform: scale(0.78) rotateY(-18deg);
        }



        #nav-cage {
                            display: block;
            width: max-content;
            min-width: 500px;
            overflow: hidden;
            transition-duration: 0.3s;
        }


        #nav-scrollX {
                            display: inline-block;
            height: min-content;
            width: calc(100% - 100px);
            overflow-x: hidden;
            margin: 0;
            flex-basis: 1;
            flex-grow: 2;
            flex-shrink: 2;
            transition-duration: 0.3s;
        }

        #nav-bar {
                            display: flex;
            align-items: center;

            height: min-content;
            overflow: hidden;
            width: 100%;
        }

        #nav-bar>#nav-left {
                            float: left;
        }

        #nav-bar>#nav-left::after {
                            content: "";
            display: block;
            clear: both;
        }

        #nav-bar>#nav-right {
                            float: right;
        }



        #menuPlace>.dropdown-menu { }
                    </style>
</head>


                <body>
                    <div id="root">

                        <div id="main">
                            <header>
                                test
            </header>
                            <nav id="nav-bar" class="navbar navbar-expand-md navbar-light bg-light">
                                <a id="nav-left" o link-func="scrollNav" link-trig="mouseover mouseleave click"
                                    class="btn-scroll fa fa-chevron-left"></a>
                                <!-- <button class="navbar-toggler end-0" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button> -->
                <div id="nav-scrollX" link-func="scrollNav" link-trig="scroll click">

                                    <div id="nav-cage">
                                        <ul id="nav" class="nav-pills nav">

                                            <li link-trig="click mouseover mouseleave" link-func="highlightTab" class="nav-item ">
                                                <button data-bs-toggle="tab" class="nav-link" id="homeTab" href="#"
                                                    aria-current="page">Home</button>
                                            </li>
                                            <li link-trig="click mouseover mouseleave" link-func="highlightTab" class="nav-item">
                                                <button data-bs-toggle="tab" class="nav-link" href="#">About Us</button>


                                                <ul style="position: fixed;" class="list-menu dropdown-menu">
                                                    <li class="list-item dropdown-item">one</li>
                                                    <li class="list-item dropdown-item">two</li>
                                                    <li class="list-item dropdown-item">three</li>
                                                </ul>

                                            </li>
                                            <li link-trig="click mouseover mouseleave" link-func="highlightTab" class="nav-item">
                                                <button data-bs-toggle="tab" class="nav-link " href="#">Services</button>
                                            </li>
                                            <li link-trig="click mouseover mouseleave" link-func="highlightTab" class="nav-item">
                                                <button data-bs-toggle="tab" class="nav-link" href="#">Open Vocations</button>
                                            </li>
                                            <li link-trig="click mouseover mouseleave" link-func="highlightTab" class="nav-item">
                                                <button data-bs-toggle="tab" class="nav-link" href="#">Actions</button>
                                                <ul style="position: fixed;" class="list-menu dropdown-menu">
                                                    <li class="list-item dropdown-item">one</li>
                                                    <li class="list-item dropdown-item">two</li>
                                                    <li class="list-item dropdown-item">three</li>
                                                </ul>
                                            </li>
                                            <div id="tab-selector" class="selector nav-link"></div>
                                        </ul>
                                    </div>

                                </div>

                                <a id="nav-right" link-trig=" click mouseover mouseleave" class="btn-scroll fa fa-chevron-right"
                                    link-func="scrollNav"></a>
                            </nav>
                        </div>
                    </div>
                    <div id="fullscreen-menu" class="yt-film">
                        <div id="close-menu" class="btn-close"></div>
                        <div id="title-place" class="nav-pills">
                            <div id="icon-place"></div>
                            <div id="text-place"></div>
                        </div>
                        <div id="menu-place">

                        </div>
                    </div>
    </div>
                <script>
                    var mainLoop;
        $(document).ready(function () {
                        setupNav()
            async()
            screenChanged();
            window.onresize = screenChanged;

        })
        function async() {
                        mainLoop = setInterval(function () {

                        }, 800)
                    }
        /** */
        function fixPos(rect, frame = window) {
            if (rect == null) throw new Error("null argument(s)")

            let top = (rect.top) ? rect.top : (rect.bottom) ? frame.height - rect.bottom - rect.height : 0;
            let left = (rect.left) ? rect.left : (rect.right) ? frame.width - rect.right - rect.width : 0;
            let maxLeft = ((frame == window) ? window.innerWidth : frame.width) - rect.width;
            let maxTop = ((frame == window) ? window.innerHeight : frame.height) - rect.height;
            if (maxLeft < 0) {rect.width = frame.width; maxLeft = 0; }
            if (maxTop < 0) {rect.height = frame, height; maxTop = 0; }
            if (top > maxTop) rect.top = maxTop;
            if (left > maxLeft) rect.left = maxLeft;
        }
        function screenChanged() {

            try {
                //Get done with the nav
                if (window.innerWidth >= 500) {
                        menuType = 0;
                    $(".nav.nav-pills").removeClass("fullscreen")
                } else {
                        menuType = 1;
                    $("tab-selector").show()
                    $(".nav.nav-pills").addClass("fullscreen")
                }

                let tabs = document.querySelectorAll(".nav-pills>.nav-item")
                for (let ind = 0; ind < tabs.length; {
                    const tab = tabs[ind];
                    hideDropdownMenu(tab, 0)
                }

                $("#tab-selector").hide();
                $("#main").removeClass("yt-blurred")
                $("#fullscreen-menu").removeClass("yt-active")
                $("#nav-scrollX").get()[0].click();
                if (fullscreenSelector != null) fullscreenSelector.remove();
            } catch (error) {
                        console.log(error)
                    }
            console.log("screen setup done")

        }
        {
                        let navLeft, navRight;
            var setupNav = function () {
                        registerFunc("highlightTab", function (event, allTabs) {
                            if (!$(event.target).hasClass("nav-link")) return;
                            let others = [];
                            for (let ind = 0; ind < allTabs.length; ind++) {
                                const tab = allTabs[ind];
                                if (tab != event.currentTarget) {
                                    others.push(tab)
                                    hideDropdownMenu(tab, tabTransition)
                                }

                            }

                            if (menuType == 0) {
                                let selector = document.getElementById("tab-selector")
                                $(selector).fadeIn().show()
                                let offset = $(event.currentTarget).offset();
                                $(others).removeClass("active")
                                $(event.currentTarget).addClass("active")
                                event.currentTarget.querySelector(".list-menu")
                                copyDimensions(event.currentTarget, selector, tabTransition);
                                translateTo(selector, [event.currentTarget, false], [event.currentTarget, false], tabTransition).complete = function () {
                                    toggleDropdownMenu(event.currentTarget, tabTransition, event);
                                }

                            } else {
                                if (event.type == "click")
                                    showFullScreenMenu(event.currentTarget, tabTransition)
                            }
                        })
                registerFunc("scrollNav", function (event) {
                        let _navScroll = $("#nav-scrollX"), navScroll = _navScroll.get()[0], left = document.getElementById("nav-left"), right = document.getElementById("nav-right")
                    let ex = navScroll.scrollLeft + navScroll.clientWidth;
                    let space = 0;
                    if (navScroll.scrollLeft > 4) {
                        $(left).show(tabTransition);
                        space += 50;
                    } else {
                        $(left).hide(tabTransition * 2);
                    }
                    if (ex < navScroll.scrollWidth - 3) {
                        $(right).show(tabTransition);
                        space += 50;
                    } else {
                        $(right).hide(tabTransition * 2);
                    }
                    // navScroll.style.width = "calc(100% - " + space + ")"
                    if ($(event.currentTarget).hasClass("btn-scroll")) {
                        if (event.type == "mouseleave") {

                            if (navLeft != null) clearInterval(navLeft)
                            if (navRight != null) clearInterval(navRight)
                            navLeft = null;
                            navRight = null;
                        } else if (event.type == "mouseover") {
                            if ($(event.currentTarget).attr("id") == "nav-left") {
                                if (navLeft == null) navLeft = setInterval(function () {navScroll.scrollBy(-1, 0)}, 10);
                            }
                            else {
                                if (navLeft == null) navRight = setInterval(function () {navScroll.scrollBy(1, 0)}, 10)
                            }
                        } else if (event.type == "click") {
                            if (navLeft != null) clearInterval(navLeft)
                            if (navRight != null) clearInterval(navRight)
                            navLeft = null;
                            navRight = null;
                            navScroll.scrollBy()
                            if ($(event.currentTarget).attr("id") == "nav-left") {
                        navScroll.scrollBy(-20, 0)
                    }
                            else {
                        navScroll.scrollBy(20, 0)
                    }
                        }
                    }
                })
            }
        }




        function copyAbsoluteLayout(source, dest, duration = 300) {
            //Margin not considered

            if (duration == 0) {
                        dest.style.boxSizing = source.style.boxSizing;

                dest.style.height = source.offsetHeight;
                dest.style.width = source.offsetWidth;
                dest.style.top = source.offsetTop;
                dest.style.left = source.offsetTop;
                return null;
            }

            let anim = anime({duration: duration, height: [dest.style.height, parseInt(source.offsetHeight)], width: [dest.style.width, parseInt(source.offsetWidth)], top: [dest.style.top, parseInt(source.offsetTop)], left: [dest.offsetLeft, parseInt(source.offsetLeft)], targets: dest, easing: "easeOutQuad" });
            return anim;
        }

        var menuType = 0, selecting = false, previousTab = null, tabTransition = 300;

        {
            var fullscreenSelector;
            let titlePlace, menuPlace, textPlace, iconPlace;

            var showFullScreenMenu = function (tab, duration) {
                //Get things ready
                if (!(tab instanceof HTMLElement)) return false;
                let menu = tab.querySelector(".nav-item>.list-menu")
                if (menu == null) return false;
                let title = tab.querySelector(".nav-link")
                if (titlePlace == null) {
                        titlePlace = document.getElementById("title-place")
                    menuPlace = document.getElementById("menu-place")
                    textPlace = document.getElementById("text-place")
                    iconPlace = document.getElementById("icon-place")
                }
                if (fullscreenSelector != null) {
                        fullscreenSelector.remove();
                    fullscreenSelector = null;
                }



                //Do all the necessary clones
                fullscreenSelector = $(title).clone(true, true);
                fullscreenSelector.addClass(".fullscreen-selector")
                fullscreenSelector = fullscreenSelector.get()[0]
                titlePlace.appendChild(fullscreenSelector)
                translateTo(fullscreenSelector, [title], [title], 0)
                title.style.opacity = 0;
                $(menuPlace.children).remove();

                // Start translating the selector
                $("#fullscreen-menu").addClass("yt-active")
                $("#main").addClass("yt-blurred")
                translateTo(fullscreenSelector, ["mid", textPlace], ["mid", textPlace], tabTransition)
                    .complete = function () {

                        let items = $(menu.children).clone(true);
                        let _items = items.get();
                        items.css("opacity", 0).click(function () {hideFullScreenMenu(tab, duration)});
                        $(menuPlace).append(items)
                        $("#close-menu").click(function () {hideFullScreenMenu(tab, duration)})
                        anime({targets: _items, opacity: [0.3, 1], translateY: ["-60%", 0], duration: duration, delay: anime.stagger(duration / _items.length), easing: "easeOutQuad" });

                    };
            }



            hideFullScreenMenu = function (tab, duration = 300) {
                if (!(tab instanceof HTMLElement)) return false;
                if (titlePlace == null) {
                        titlePlace = document.getElementById("title-place")
                    menuPlace = document.getElementById("menu-place")
                    textPlace = document.getElementById("text-place")
                    iconPlace = document.getElementById("icon-place")
                }
                let title = tab.querySelector(".nav-link")
                if (title == null) return false;
                translateTo(fullscreenSelector, [title], [title], tabTransition).complete = function () {
                        title.style.opacity = 1;

                    $("#main").removeClass("yt-blurred")
                    $("#fullscreen-menu").removeClass("yt-active")
                    setTimeout(function () {
                        if (fullscreenSelector != null) {
                        fullscreenSelector.remove();
                            fullscreenSelector = null;
                        }
                    }, 300);
                }

            }
        }
        function hideDropdownMenu(host, duration = 300) {

            try {
                if (!(host instanceof HTMLElement) || typeof duration != "number" || duration < 0) return false;
                let menu = host.querySelector(".list-menu")
                if (menu == null) return false;
                if (!$(menu).hasClass("show")) return true;
                let items = $(menu).children();
                items = items.filter(function (ind, item) {
                    return $(item).hasClass("list-item")
                })
                anime({targets: items, opacity: [1, 0.3], translateY: [0, "-60%"], duration: duration, delay: anime.stagger(duration / items.get().length), easing: "easeOutQuad" })
                $(menu).slideUp(duration, function () {$(menu).hide().removeClass("show").addClass("yt-collapsed")});
                anime({targets: menu, translateY: ["-30%", 0], duration: duration, maxHeight: ["0px"], easing: "easeOutQuad" }).complete = function () {$(menu).hide().removeClass("show")};
                return true;
            } catch (error) {
                        console.log(error)

                return false;
            }

        }
        function toggleDropdownMenu(host, duration = 300, event) {
            if (!(host instanceof HTMLElement) || event == null) return false;
            let menu = host.querySelector(".list-menu")
            if (menu == null) return false; console.log(event);
            if (!$(menu).hasClass("show")) showDropdownMenu(host, duration);
            else if (event.type == "click" || event.type == "mouseleave") hideDropdownMenu(host, duration);
            else { return false; }
            return true;
        }


        function showDropdownMenu(host, duration = 300, autoHide = true, x = ["mid", host], y = ["below", host]) {
            try {

                if (!(host instanceof HTMLElement)) return false;
                let menu = host.querySelector(".list-menu")
                if (menu == null) return false;
                if ($(menu).hasClass("show")) return true;
                let items = $(menu).children();
                items = items.filter(function (ind, item) {
                    return $(item).hasClass("list-item")
                })
                if (autoHide) {
                        $(items).off("click").click(function (event) { hideDropdownMenu(host, duration); })
                    $(host).off("mouseleave").mouseleave(function (event) {hideDropdownMenu(host, duration); })
                };
                $(menu).css("height", "fit-content").css("max-height", "").show();
                let menuHeight = $(menu).height()
                $(menu).addClass("show")
                align(menu, x, y, 0)
                    .complete = function () {
                        anime({ targets: menu, translateY: ["-30%", 0], duration: 300, maxHeight: ["0px", menuHeight + 80 + "px"], easing: "easeOutQuad" });
                        anime({targets: items.get(), opacity: [0.3, 1], translateY: ["-60%", 0], duration: duration, delay: anime.stagger(duration / items.get().length), easing: "easeOutQuad" });
                    }
                return true;
            } catch (error) {
                        console.log(error)
                return false;
            }
        }


    </script>
</body>


        </html>