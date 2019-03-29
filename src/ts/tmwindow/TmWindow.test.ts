import TmWindow from "./TmWindow";
import {cssMap} from "./ITmWindowCssMap";
import {ITmWindowOptions} from "./ITmWindowOptions";

const defaultOptions = TmWindow.getDefaultOptions();

function emitMouseEvent(el: EventTarget, name: string) {
    const e = document.createEvent("MouseEvent");
    e.initEvent(name, true, true);
    Object.defineProperty(e, "pageX", {
        value: 10
    });
    Object.defineProperty(e, "pageY", {
        value: 10
    });
    el.dispatchEvent(e);
}
function emitTouchEvent(el: EventTarget, name: string) {
    const e = document.createEvent("TouchEvent");
    (e.touches[0] as Partial<Touch>) = {
        clientX: 5, clientY: 5,
    } ;
    e.initEvent(name, true, true);
    el.dispatchEvent(e);
}

describe("TmWindow", function () {
    test("construct open minimize close remove", () => {
        const tmw = new TmWindow();
        expect(tmw.domElement.parentNode).toBe(document.body);
        expect(tmw.isOpen).toBe(false);
        expect(tmw.isClosed).toBe(true);
        expect(tmw.isMinimized).toBe(false);
        tmw.open();
        expect(tmw.isOpen).toBe(true);
        expect(tmw.isClosed).toBe(false);
        expect(tmw.isMinimized).toBe(false);
        tmw.minimize();
        expect(tmw.isOpen).toBe(false);
        expect(tmw.isClosed).toBe(false);
        expect(tmw.isMinimized).toBe(true);
        tmw.toggle("close");
        expect(tmw.isOpen).toBe(false);
        expect(tmw.isClosed).toBe(true);
        expect(tmw.isMinimized).toBe(false);
        tmw.toggle();
        expect(tmw.isOpen).toBe(true);
        expect(tmw.isClosed).toBe(false);
        expect(tmw.isMinimized).toBe(false);
        tmw.toggle("minimize");
        expect(tmw.isOpen).toBe(false);
        expect(tmw.isClosed).toBe(false);
        expect(tmw.isMinimized).toBe(true);
        tmw.setOption("removeOnClose", true);
        tmw.close();
        expect(tmw.domElement.parentNode).toBe(null);
    });

    test("reappend", () => {
        const tmw = new TmWindow();
        expect(tmw.reappend.bind(tmw)).not.toThrow();

    });

    test("construct with string", () => {
        let testTitle = "test title";
        const tmw = new TmWindow(testTitle);

        expect(tmw.title).toBe(testTitle);
        expect(tmw.content).toBe(defaultOptions.content);
        expect(tmw.domElement.classList).toContain(cssMap.wrapper);
        expect(tmw.domElement.classList).toContain(cssMap.wrapperClosed);
        expect(tmw.domElement.classList).toContain(cssMap.resizable);

        tmw.title = "other title";
        tmw.content = "test";
        expect(tmw.title).toBe("other title");
        expect(tmw.content).toBe("test");
    });

    test("construct with object", () => {
        const options: ITmWindowOptions = {
            title: "test title",
            content: "test content",
            className: "test bonusClass",
            height: 200,
            width: 100,
            id: "test-id",
            style: {
                verticalAlign: "middle",
                border: "0",
            }
        };
        const tmw = new TmWindow(options);
        expect(tmw.content).toBe(options.content);
        expect(tmw.title).toBe(options.title);
        expect(tmw.domElement.id).toBe(options.id);
        expect(tmw.domElement.classList).toContain("test");
        expect(tmw.domElement.classList).toContain("bonusClass");
        expect(tmw.domElement.style.height).toBe(options.height + "px");
        expect(tmw.domElement.style.width).toBe(options.width + "px");
        expect(tmw.domElement.style.verticalAlign).toBe("middle");
        expect(tmw.domElement.style.border).toBe("0px");

        tmw.minimize();
        tmw.open();
        //test preserve styles
        expect(tmw.domElement.style.verticalAlign).toBe("middle");
        expect(tmw.domElement.style.border).toBe("0px");
    });

    test("set position", () => {
        let tmw = new TmWindow();
        tmw.setPosition(10, 20);
        expect(tmw.domElement.style.left).toBe("10px");
        expect(tmw.domElement.style.top).toBe("20px");
        tmw.setPosition("10%", "20%");
        expect(tmw.domElement.style.left).toBe("10%");
        expect(tmw.domElement.style.top).toBe("20%");
    });

    test("set dom element", () => {
        const title = document.createElement("div");
        const content = document.createElement("div");
        const tmw = new TmWindow();

        tmw.setOption("title", title)
            .setOption("content", content);

        expect(tmw.title).toBe(title);
        expect(tmw.content).toBe(content);

        //append an additional child
        const child2 = document.createElement("button");
        tmw.appendChild(child2);
        expect(child2.parentElement).toBe(content.parentElement);
    });

    test("change defaults", () => {
        // require a separate instance so we dont mess with the imported instance
        let {default: TmWindow} = require("./TmWindow");
        let tmwOrig = new TmWindow();

        expect(TmWindow.getDefaultOption("removeOnClose")).toBe(defaultOptions.removeOnClose);
        TmWindow.setDefaultOption("resizable", !defaultOptions.resizable)
            .setDefaultOption("contain", !defaultOptions.contain)
            .setDefaultOptions({content: "test default content"});
        // dont change existing instance options
        let ogOpts = tmwOrig.getOptions();
        expect(ogOpts.resizable).toBe(defaultOptions.resizable);
        expect(ogOpts.contain).toBe(defaultOptions.contain);

        const tmw = new TmWindow();
        expect(tmw.getOption("resizable")).toBe(!defaultOptions.resizable);
        expect(tmw.getOption("contain")).toBe(!defaultOptions.contain);
        expect(tmw.content).toBe("test default content")
    });

    test("mouse events", () => {
        const tmw = new TmWindow();
        tmw.open();
        let title: HTMLElement = tmw.domElement.querySelector("." + cssMap.title);
        emitMouseEvent(title, "mousedown");
        expect(tmw.domElement.classList).toContain(cssMap.grabbed);
        emitMouseEvent(window, "mousemove");
        emitMouseEvent(title, "mouseup");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);

        // no repositioning when minimized
        tmw.minimize();
        emitMouseEvent(title, "mousedown");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);
    });

    test("mouse events no contain", () => {
        const tmw = new TmWindow();
        tmw.setOption("contain", false);
        tmw.open();
        let title: HTMLElement = tmw.domElement.querySelector("." + cssMap.title);
        emitMouseEvent(title, "mousedown");
        expect(tmw.domElement.classList).toContain(cssMap.grabbed);
        emitMouseEvent(window, "mousemove");
        emitMouseEvent(title, "mouseup");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);

        // no repositioning when minimized
        tmw.minimize();
        emitMouseEvent(title, "mousedown");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);
    });

    test("touch events", () => {
        const tmw = new TmWindow();
        tmw.open();
        let title: HTMLElement = tmw.domElement.querySelector("." + cssMap.title);
        emitTouchEvent(title, "touchstart");
        expect(tmw.domElement.classList).toContain(cssMap.grabbed);
        emitTouchEvent(window, "touchmove");
        emitTouchEvent(title, "touchend");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);

        // no repositioning when minimized
        tmw.minimize();
        emitTouchEvent(title, "touchstart");
        expect(tmw.domElement.classList).not.toContain(cssMap.grabbed);
    });

    test("getters height width", () => {
        const tmw = new TmWindow();
        tmw.open();
        //calculated height and width will always be zero in node context?
        // if you think this is wrong, raise an issue
        expect(typeof tmw.height).toBe("number");
        expect(typeof tmw.width).toBe("number");
    });
});