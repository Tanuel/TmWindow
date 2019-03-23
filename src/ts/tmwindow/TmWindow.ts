import {clearSelection, create, each, empty} from "tmutil";
import {cssMap} from "./ITmWindowCssMap";
import {ITmWindowOptions} from "./ITmWindowOptions";

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

/**
 * Default options used by TmWindow
 */
const defaultOptions: ITmWindowOptions = {
    contain: true,
    content: "",
    removeOnClose: false,
    resizable: true,
    style: {},
    title: "",
};

export default class TmWindow {

    get isOpen(): boolean {
        return this.domElement.classList.contains(cssMap.wrapperOpen);
    }

    get isClosed(): boolean {
        return this.domElement.classList.contains(cssMap.wrapperClosed);
    }

    get isMinimized(): boolean {
        return this.domElement.classList.contains(cssMap.wrapperMinimized);
    }

    get title(): ITmWindowOptions["title"] {
        return this.getOption("title");
    }

    set title(title: ITmWindowOptions["title"]) {
        this.setOption("title", title);
    }

    set width(width: number) {
        this.domElement.style.width = width + "px";
    }

    /**
     * Set the x position (style.left)
     * If a number is passed, it will be treated as a pixel value
     * @param x
     */
    set x(x: string | number) {
        this.domElement.style.left = typeof x === "string" ? x : x + "px";
    }

    /**
     * Set the y position (style.top)
     * If a number is passed, it will be treated as a pixel value
     * @param y
     */
    set y(y: string | number) {
        this.domElement.style.top = typeof y === "string" ? y : y + "px";
    }

    get content(): ITmWindowOptions["content"] {
        return this.getOption("content");
    }

    set content(content: ITmWindowOptions["content"]) {
        this.setOption("content", content);
    }
    public static readonly defaultOptions: ITmWindowOptions = defaultOptions;

    public static getDefaultOption<T extends keyof ITmWindowOptions>(name: T): ITmWindowOptions[T];
    public static getDefaultOption(name: keyof ITmWindowOptions) {
        return TmWindow.defaultOptions[name];
    }

    // tslint:disable-next-line:max-line-length
    public static setDefaultOption<T extends keyof ITmWindowOptions>(name: T, value: ITmWindowOptions[T]): typeof TmWindow;
    public static setDefaultOption(name: keyof ITmWindowOptions, value: any): typeof TmWindow {
        TmWindow.defaultOptions[name] = value;
        return TmWindow;
    }

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

    public setOption<T extends keyof ITmWindowOptions>(name: T, value: ITmWindowOptions[T]): this;
    public setOption(name: keyof ITmWindowOptions, value: any): this {
        this.options[name] = value;
        switch (name) {
            case "title":
                if (value instanceof HTMLElement) {
                    empty(this.titleElement).appendChild(value);
                } else {
                    this.titleElement.innerHTML = value;
                }
                break;
            case "content":
                if (value instanceof HTMLElement) {
                    empty(this.contentElement).appendChild(value);
                } else {
                    this.contentElement.innerHTML = value;
                }
                break;
            case "resizable":
                this.domElement.classList.toggle(cssMap.resizable, !!value);
                break;
            default:
                break;
        }
        return this;
    }

    public getOption<T extends keyof ITmWindowOptions>(name: T): ITmWindowOptions[T];
    public getOption(name: keyof ITmWindowOptions) {
        return this.options[name];
    }

    public appendChild<T extends Node>(element: T): this {
        this.contentElement.appendChild(element);
        return this;
    }

    /**
     * Set the position of the window.
     * If the params are strings, they will be set as direct values,
     * if the params are numbers, they will be set as pixel values
     *
     * @param x
     * @param y
     */
    public setPosition(x: string | number, y: string | number): this {
        this.domElement.style.left = typeof x === "string" ? x : x + "px";
        this.domElement.style.top = typeof y === "string" ? y : y + "px";
        return this;
    }

    /**
     * Open/Show the window.
     * Previous styles and the position will be restored.
     */
    public open(): this {
        const de = this.domElement;
        if (this.isMinimized && typeof this.lastStyle === "object") {
            each(this.lastStyle, (key, value) => {
                de.style[key] = value;
            });
        }
        de.classList.remove(cssMap.wrapperClosed, cssMap.wrapperMinimized);
        de.classList.add(cssMap.wrapperOpen);
        return this;
    }

    /**
     * Close the window. If the option "removeOnClose" is set to true,
     * the window will be removed from the dom.
     * Current position will be preserved.
     * @param event
     */
    public close(event): this {
        if (this.getOption("removeOnClose")) {
            this.remove();
            event.stopImmediatePropagation();
        } else {
            this.domElement.classList.remove(cssMap.wrapperOpen);
            this.domElement.classList.add(cssMap.wrapperClosed);
        }
        return this;
    }

    /**
     * Remove the window from the DOM
     */
    public remove(): this {
        this.domElement.parentNode.removeChild(this.domElement);
        return this;
    }

    /**
     * Minimize the window.
     * Current position will be preserved.
     */
    public minimize(): this {
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
        return this;
    }

    /**
     * Append the window to the parent element again.
     * This is a trick to show the window above other windows or elements
     * without messing around with the z-index
     */
    public reappend(): this {
        this.domElement.parentElement.appendChild(this.domElement);
        return this;
    }

    /**
     * Build the window wrapper
     * @private
     */
    private _buildWindow(): HTMLDivElement {
        const wrapper = create("div", {
            className: cssMap.wrapper + " " + cssMap.wrapperClosed,
            style: {
                left: "10px",
                top: "10px",
                ...this.options.style,
            },
        });

        if (this.options.resizable) {
            wrapper.classList.add(cssMap.resizable);
        }

        const header = this.headerElement = this._buildHeader();
        const content = this.contentElement = this._buildContent();

        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.addEventListener("click", this.reappend.bind(this));
        return wrapper;
    }

    /**
     * Build the window header, containing the title and action buttons
     * @private
     */
    private _buildHeader(): HTMLDivElement {
        // _headerElement element
        const headerElement = create("div", {className: cssMap.header});
        // title element
        const title = this.getOption("title");
        const titleElement = this.titleElement = create("div", {className: cssMap.title});
        if (title instanceof HTMLElement) {
            titleElement.appendChild(title);
        } else {
            titleElement.innerHTML = title;
        }
        this._addRepositionEvent(titleElement);
        // buttons
        const btns = this._buildHeaderButtons();

        headerElement.appendChild(titleElement);
        headerElement.appendChild(btns);

        return headerElement;
    }

    /**
     * Creates the action buttons for the header element
     * @private
     */
    private _buildHeaderButtons(): HTMLDivElement {
        const wrap = create("div", {className: cssMap.headerButtons});

        // close button
        const btnClose = this._buildButton(cssMap.btnClose, this.close.bind(this));
        wrap.appendChild(btnClose);

        // minimize button
        const btnMin = this._buildButton(cssMap.btnMinimize, this.minimize.bind(this));
        wrap.appendChild(btnMin);
        return wrap;
    }

    /**
     * create a single button
     * @param className
     * @param callback
     * @private
     */
    private _buildButton(className: string, callback: () => any): HTMLButtonElement {
        const btn = create("button", {
            className,
            tabIndex: -1,
        });
        btn.addEventListener("click", callback);
        return btn;
    }

    /**
     * Create the content element a.k.a. the window body
     * @private
     */
    private _buildContent(): HTMLDivElement {
        const contentElement = create("div", {className: cssMap.content});

        const content = this.getOption("content");
        if (content instanceof HTMLElement) {
            contentElement.appendChild(content);
        } else {
            contentElement.innerHTML = content;
        }
        return contentElement;
    }

    /**
     * Creates and binds the drag&drop events to move the window around
     * @param el
     * @private
     */
    private _addRepositionEvent(el: HTMLElement ) {
        const repo = this._repositionEvent.bind(this);
        const md: IMouseDownEventPositions = this.mouseDownEv = {};

        el.addEventListener("mousedown", (event: MouseEvent) => {
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

    private _repositionEvent(ev: MouseEvent) {
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
