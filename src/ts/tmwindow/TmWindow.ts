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
 * Override with TmWindow.setDefaultOption(key, value)
 */
const defaultOptions: ITmWindowOptions = {
    className: "",
    contain: true,
    content: "",
    id: "",
    removeOnClose: false,
    resizable: true,
    style: {},
    title: "",
};

/**
 * The TmWindow class
 */
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

    get height(): number {
        return this.domElement.offsetHeight;
    }

    set height(height: number) {
        this.domElement.style.height = height + "px";
    }

    get width(): number {
        return this.domElement.offsetWidth;
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
     * Set the y position (style.top).
     * If a number is passed, it will be treated as a pixel value.
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

    /**
     * Get a default Option.
     * @param name
     */
    public static getDefaultOption<T extends keyof ITmWindowOptions>(name: T): ITmWindowOptions[T];

    public static getDefaultOption(name: keyof ITmWindowOptions) {
        return this.defaultOptions[name];
    }

    /**
     * Set a default option.
     * This will not change the options on existing instances.
     * @param name
     * @param value
     */
    // tslint:disable-next-line:max-line-length
    public static setDefaultOption<T extends keyof ITmWindowOptions>(name: T, value: ITmWindowOptions[T]): typeof TmWindow;

    public static setDefaultOption(name: keyof ITmWindowOptions, value: any): typeof TmWindow {
        (this.defaultOptions[name] as any) = value;
        return this;
    }

    /**
     * Get a copy of all current default options
     *
     * It is recommended to not change the values in the returned object,
     * but rather pass changes to TmWindow.setDefaultOption(s)
     */
    public static getDefaultOptions(): ITmWindowOptions {
        return {...this.defaultOptions};
    }

    /**
     * Set an object of default options.
     *
     * Options not set will stay at the previous values.
     *
     * This method will call setDefaultOption on every top level object entry.
     * @param options
     */
    public static setDefaultOptions(options: ITmWindowOptions): typeof TmWindow {
        each(options, (key: keyof ITmWindowOptions, value) => {
            this.setDefaultOption(key, value);
        });
        return this;
    }

    private static readonly defaultOptions: ITmWindowOptions = defaultOptions;
    /**
     * The top level dom element from the window
     */
    public readonly domElement: HTMLElement;
    private readonly options: ITmWindowOptions;
    private headerElement: HTMLElement;
    private titleElement: HTMLElement;
    private contentElement: HTMLElement;
    private lastStyle: any;
    private mouseDownEv: IMouseDownEventPositions;

    /**
     * Pass a string to be used as title or an object of options
     * @param options
     */
    constructor(options: ITmWindowOptions | string = {}) {
        if (typeof options === "object") {
            this.options = {...defaultOptions, ...options};
        } else {
            this.options = {...defaultOptions, title: options};
        }
        this.domElement = this._buildWindow();
        this.setOptions(this.options);
        document.body.appendChild(this.domElement);
    }

    /**
     * Change an option. Can be chained.
     * @param name
     * @param value
     */
    public setOption<T extends keyof ITmWindowOptions>(name: T, value: ITmWindowOptions[T]): this;
    public setOption(name: keyof ITmWindowOptions, value: any): this {
        // Apply option first in case we need the old value
        switch (name) {
            case "className":
                // remove previous class
                if (this.options.className.length > 0) {
                    this.options.className.split(" ").forEach((cl) => {
                        this.domElement.classList.remove(cl);
                    });
                }
                // Add new class
                if (value.length > 0) {
                    (value as string).split(" ").forEach((cl) => {
                        this.domElement.classList.add(cl);
                    });
                }
                break;
            case "content":
                if (value instanceof HTMLElement) {
                    empty(this.contentElement).appendChild(value);
                } else {
                    this.contentElement.innerHTML = value;
                }
                break;
            case "height":
                this.height = value;
                break;
            case "id":
                this.domElement.id = value;
                break;
            case "style":
                each(value, (key, val) => {
                    this.domElement.style[key] = val;
                });
                break;
            case "title":
                if (value instanceof HTMLElement) {
                    empty(this.titleElement).appendChild(value);
                    this.titleElement.title = value.textContent;
                } else {
                    this.titleElement.innerHTML = value;
                    this.titleElement.title = value;
                }
                break;
            case "resizable":
                this.domElement.classList.toggle(cssMap.resizable, !!value);
                break;
            case "width":
                this.width = value;
                break;
            default:
                break;
        }

        // Store option
        (this.options[name] as any) = value;

        return this;
    }

    /**
     * Get an option value
     * @param name
     */
    public getOption<T extends keyof ITmWindowOptions>(name: T): ITmWindowOptions[T];
    public getOption(name: keyof ITmWindowOptions) {
        return this.options[name];
    }

    /**
     * Get a copy of all current options.
     * It is important for options to be changed through this.setOption, so the reference to the instance
     * options has to be somewhat removed.
     *
     * Change values from the returned object at your own risk!
     */
    public getOptions(): ITmWindowOptions {
        return {...this.options};
    }

    /**
     * Set an object of options.
     *
     * Options not set will stay at the previous values.
     *
     * This method will call setOption on every top level object entry.
     * @param options
     */
    public setOptions(options: ITmWindowOptions): this {
        each(options, (key: keyof ITmWindowOptions, value) => {
            this.setOption(key, value);
        });
        return this;
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
        this.x = x;
        this.y = y;
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
     * Switch state between open and closed.
     * Pass a string to force an action (can also minimize this way).
     * @param action
     */
    public toggle(action?: "open" | "minimize" | "close"): this {
        if (action === "open"
            || action !== "minimize" && action !== "close" && !this.isOpen
        ) {
            this.open();
        } else if (action === "minimize") {
            this.minimize();
        } else {
            this.close();
        }
        return this;
    }

    /**
     * Close the window. If the option "removeOnClose" is set to true,
     * the window will be removed from the dom.
     * Current position will be preserved.
     */
    public close(): this {
        this.domElement.classList.remove(cssMap.wrapperOpen, cssMap.wrapperMinimized);
        this.domElement.classList.add(cssMap.wrapperClosed);

        if (this.options.removeOnClose) {
            this.remove();
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
        if (!this.isMinimized) {
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
            },
        });

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
        const headerElement = create("div", {className: cssMap.header});
        const titleElement = this.titleElement = create("div", {className: cssMap.title});
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
        const btnMin = this._buildButton(cssMap.btnMinimize, this.toggle.bind(this, "minimize"));
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
        return create("div", {className: cssMap.content});
    }

    /**
     * Creates and binds the drag&drop events to move the window around
     * @param el
     * @private
     */
    private _addRepositionEvent(el: HTMLElement) {
        const repo = this._repositionEvent.bind(this);
        const md: IMouseDownEventPositions = this.mouseDownEv = {};

        const repoEventListener = (ev: MouseEvent | TouchEvent) => {
            if (this.isMinimized) {
                return;
            }
            ev.preventDefault();
            clearSelection();
            md.x = ev instanceof TouchEvent ? ev.touches[0].clientX : ev.pageX;
            md.y = ev instanceof TouchEvent ? ev.touches[0].clientY : ev.pageY;
            const rect = this.domElement.getBoundingClientRect();
            md.top = rect.top;
            md.left = rect.left;
            this.domElement.classList.add(cssMap.grabbed);
            window.addEventListener(ev instanceof TouchEvent ? "touchmove" : "mousemove", repo);
        };
        el.addEventListener("mousedown", repoEventListener);
        el.addEventListener("touchstart", repoEventListener);

        const repoEventRemover = () => {
            this.domElement.classList.remove(cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
            window.removeEventListener("touchmove", repo);
        };
        window.addEventListener("mouseup", repoEventRemover);
        window.addEventListener("touchend", repoEventRemover);
        document.addEventListener("mouseleave", repoEventRemover);
    }

    /**
     * Handler for reposition event.
     * @param ev
     * @private
     */
    private _repositionEvent(ev: MouseEvent | TouchEvent) {
        const md = this.mouseDownEv;
        const dx = ev instanceof TouchEvent ? ev.touches[0].clientX : ev.pageX;
        const dy = ev instanceof TouchEvent ? ev.touches[0].clientY : ev.pageY;
        const newX = md.left + dx - md.x;
        const newY = md.top + dy - md.y;
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
