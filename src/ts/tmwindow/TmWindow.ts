import clearSelection from "../var/clearSelection";
import create from "../var/create";
import {cssMap} from "./ITmWindowCssMap";
import {defaultOptions, ITmWindowOptions} from "./ITmWindowOptions";

/**
 * Helper to identify mouse and window position
 * Used for repositioning the window with drag and drop
 */
interface IMouseDownEventPositions {
    x?: number;
    y?: number;
    left?: number;
    top?: number;
}

export default class TmWindow {
    public readonly domElement: HTMLElement;
    private readonly options: ITmWindowOptions;
    private headerElement: HTMLElement;
    private titleElement: HTMLElement;
    private contentElement: HTMLElement;
    private lastStyle: any;
    private mouseDownEv: IMouseDownEventPositions;

    constructor(options: ITmWindowOptions | string = {}) {
        if (typeof options === "object") {
            this.options = {...defaultOptions, ...options};
        } else {
            this.options = {...defaultOptions, title: options};
        }
        this.domElement = this._buildWindow();
        document.body.appendChild(this.domElement);
    }

    get isOpen() {
        return this.domElement.classList.contains(cssMap.wrapperOpen);
    }

    get isClosed() {
        return this.domElement.classList.contains(cssMap.wrapperClosed);
    }

    get isMinimized() {
        return this.domElement.classList.contains(cssMap.wrapperMinimized);
    }

    get title() {
        return this.titleElement.innerHTML;
    }

    set title(title: string) {
        this.setOption("title", title);
    }

    set width(width: number) {
        this.domElement.style.width = width + "px";
    }

    set x(x: number) {
        this.domElement.style.left = x + "px";
    }

    set y(y: number) {
        this.domElement.style.top = y + "px";
    }

    set content(content: any) {
        this.contentElement.innerHTML = content;
    }

    public setOption(name: string, value: any) {
        if (name in this.options) {
            (this.options as any)[name] = value;
        }
        switch (name) {
            case "title":
                this.titleElement.innerHTML = value;
                break;
            case "resizable":
                this.domElement.classList.toggle(cssMap.resizable, !!value);
                break;
            default:
                break;
        }
    }

    public getOption(name: string) {
        return name in this.options ? (this.options as any)[name] : "";
    }

    public appendElement(element: HTMLElement) {
        this.contentElement.appendChild(element);
    }

    public setPosition(x: number, y: number) {
        this.domElement.style.left = x + "px";
        this.domElement.style.top = y + "px";
    }

    public open() {
        const de = this.domElement;
        if (this.isMinimized && typeof this.lastStyle === "object") {
            for (const k in this.lastStyle) {
                de.style[k] = this.lastStyle[k];
            }
        }
        de.classList.remove(cssMap.wrapperClosed, cssMap.wrapperMinimized);
        de.classList.add(cssMap.wrapperOpen);
    }

    public close(event) {
        if (this.getOption("destroyOnClose")) {
            this.destroy();
            event.stopImmediatePropagation();
        } else {
            this.domElement.classList.remove(cssMap.wrapperOpen);
            this.domElement.classList.add(cssMap.wrapperClosed);
        }
    }

    public destroy() {
        this.domElement.parentNode.removeChild(this.domElement);
    }

    public minimize() {
        if (this.isOpen) {
            const de = this.domElement;
            const rect = de.getBoundingClientRect();
            this.lastStyle = {
                height: rect.height + "px",
                left: rect.left + "px",
                top: rect.top + "px",
                width: rect.width + "px",
            };
            de.classList.remove(cssMap.wrapperOpen);
            de.classList.add(cssMap.wrapperMinimized);
            de.style.height = "";
            de.style.left = "";
            de.style.top = "";
            de.style.width = "";
        } else {
            this.open();
        }
    }

    public reappend() {
        document.body.appendChild(this.domElement);
    }

    private _buildWindow() {
        const wrapper = create("div");
        const header = this.headerElement = this._buildHeader();
        const content = this.contentElement = this._buildContent();

        wrapper.className = cssMap.wrapper + " " + cssMap.wrapperClosed;
        if (this.options.resizable) {
            wrapper.classList.add(cssMap.resizable);
        }
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.style.top = "10px";
        wrapper.style.left = "10px";
        const styles = Object.keys(this.options.style);
        for (const key in styles) {
            wrapper.style[key] = this.options.style[key];
        }

        wrapper.addEventListener("click", this.reappend.bind(this));
        return wrapper;
    }

    private _buildHeader() {
        // _headerElement element
        const header = create("div");
        header.className = cssMap.header;
        // title element
        const title = this.titleElement = create("div");
        title.className = cssMap.title;
        title.innerHTML = this.getOption("title");
        this._addRepositionEvent(title);
        // buttons
        const btns = this._buildHeaderButtons();

        header.appendChild(title);
        header.appendChild(btns);

        return header;
    }

    private _buildHeaderButtons() {
        const wrap = create("div");
        wrap.className = cssMap.headerButtons;

        // close button
        const btnClose = this._buildButton(cssMap.btnClose, this.close.bind(this));
        wrap.appendChild(btnClose);

        // minimize button
        const btnMin = this._buildButton(cssMap.btnMinimize, this.minimize.bind(this));
        wrap.appendChild(btnMin);
        return wrap;
    }

    private _buildButton(className, callback) {
        const btn = create("button");
        btn.tabIndex = -1;
        btn.className = className;
        btn.addEventListener("click", callback);
        return btn;
    }

    private _buildContent() {
        const content = create("div");
        content.className = cssMap.content;
        content.innerHTML = this.getOption("content");
        return content;
    }

    private _addRepositionEvent(el) {
        // const repo = function(e){console.log(e);};
        const repo = this._repositionEvent.bind(this);
        const md = this.mouseDownEv = {} as IMouseDownEventPositions;

        el.addEventListener("mousedown", (event) => {
            if (this.isMinimized) {
                return;
            }
            event.preventDefault();
            clearSelection();
            md.x = event.pageX;
            md.y = event.pageY;
            const rect = this.domElement.getBoundingClientRect();
            md.top = rect.top;
            md.left = rect.left;
            this.domElement.classList.add(cssMap.grabbed);
            window.addEventListener("mousemove", repo);
        });

        window.addEventListener("mouseup", () => {
            this.domElement.classList.remove(cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
        document.addEventListener("mouseleave", () => {
            this.domElement.classList.remove(cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
    }

    private _repositionEvent(ev) {
        const md = this.mouseDownEv;
        const dx = ev.pageX - md.x;
        const dy = ev.pageY - md.y;
        const newX = md.left + dx;
        const newY = md.top + dy;
        const de = this.domElement;
        const rect = de.getBoundingClientRect();

        // check if we should contain the element in the window
        if (!this.options.contain
            || newX > 0 && (newX + rect.width) < window.innerWidth) {
            de.style.left = newX + "px";
        }

        if (!this.options.contain
            || newY > 0 && (newY + rect.height) < window.innerHeight) {
            de.style.top = newY + "px";
        }
    }
}
