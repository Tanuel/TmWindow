import clearSelection from '../var/clearSelection';
import create from  '../var/create';
import {optionsType, defaultOptions} from './options';
import {cssMap} from './css-class-map';

interface MouseDownEventPositions {
    x?,
    y?,
    left?,
    top?,
}

export default class TmWindow {
    readonly _domElement: HTMLElement;
    private options: optionsType;
    private headerElement: HTMLElement;
    private titleElement: HTMLElement;
    private contentElement: HTMLElement;
    private lastStyle: any;
    private mouseDownEv: MouseDownEventPositions;

    constructor(options = {}) {
        this.options = {...defaultOptions, ...options};
        this._domElement = this._buildWindow();
        document.body.appendChild(this._domElement);
    }

    get domElement() {
        return this._domElement;
    }

    get isOpen() {
        return this._domElement.classList.contains(cssMap.wrapperOpen);
    }

    get isClosed() {
        return this._domElement.classList.contains(cssMap.wrapperClosed);
    }

    get isMinimized() {
        return this._domElement.classList.contains(cssMap.wrapperMinimized);
    }

    get title() {
        return this.titleElement.innerHTML;
    }

    set title(title) {
        this.titleElement.innerHTML = title;
        this.setOption('title', title);
    }

    set width(width: number) {
        this._domElement.style.width = width + 'px';
    }

    set x(x: number) {
        this._domElement.style.left = x + 'px';
    }

    set y(y: number) {
        this._domElement.style.top = y + 'px';
    }

    set content(content: any) {
        this.contentElement.innerHTML = content;
    }

    public setOption(name: string, value: any) {
        if (name in this.options)
            (this.options as any)[name] = value;
    }

    public getOption(name: string) {
        return name in this.options ? (this.options as any)[name] : '';
    }

    public appendElement(element: HTMLElement) {
        this.contentElement.appendChild(element);
    }

    public setPosition(x: number, y: number) {
        this._domElement.style.left = x + 'px';
        this._domElement.style.top = y + 'px';
    }

    public open() {
        let de = this._domElement;
        if (this.isMinimized && typeof this.lastStyle === "object") {
            for (let k in this.lastStyle) {
                de.style[k] = this.lastStyle[k];
            }
        }
        de.classList.remove(cssMap.wrapperClosed, cssMap.wrapperMinimized);
        de.classList.add(cssMap.wrapperOpen);
    }

    public close(event) {
        if (this.getOption('destroyOnClose')) {
            this.destroy();
            event.stopImmediatePropagation();
        } else {
            this._domElement.classList.remove(cssMap.wrapperOpen);
            this._domElement.classList.add(cssMap.wrapperClosed);
        }
    }

    public destroy() {
        this._domElement.parentNode.removeChild(this._domElement);
    }

    public minimize() {
        if (this.isOpen) {
            let de = this._domElement;
            let rect = de.getBoundingClientRect();
            this.lastStyle = {
                top: rect.top + "px",
                left: rect.left + "px",
                height: rect.height + "px",
                width: rect.width + "px"
            };
            de.classList.remove(cssMap.wrapperOpen);
            de.classList.add(cssMap.wrapperMinimized);
            de.style.top = '';
            de.style.left = '';
            de.style.height = '';
            de.style.width = '';
        } else {
            this.open();
        }
    }

    public reappend() {
        document.body.appendChild(this._domElement);
    }

    private _buildWindow() {
        const wrapper = create("div"),
            header = this.headerElement = this._buildHeader(),
            content = this.contentElement = this._buildContent();

        wrapper.className = cssMap.wrapper + " " + cssMap.wrapperClosed;
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.style.top = "10px";
        wrapper.style.left = "10px";
        let styles = Object.keys(this.options.style);
        for (let key in styles) {
            wrapper.style[key] = this.options.style[key];
        }

        wrapper.addEventListener("click", this.reappend.bind(this));
        return wrapper;
    }

    private _buildHeader() {
        //_headerElement element
        const header = create("div");
        header.className = cssMap.header;
        //title element
        const title = this.titleElement = create("div");
        title.className = cssMap.title;
        title.innerHTML = this.getOption("title");
        this._addRepositionEvent(title);
        //buttons
        const btns = this._buildHeaderButtons();

        header.appendChild(title);
        header.appendChild(btns);

        return header;
    }

    private _buildHeaderButtons() {
        const wrap = create("div");
        wrap.className = cssMap.headerButtons;

        //close button
        const btnClose = this._buildButton(cssMap.btnClose, this.close.bind(this));
        wrap.appendChild(btnClose);

        //minimize button
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
        //const repo = function(e){console.log(e);};
        const repo = this._repositionEvent.bind(this);
        let md = this.mouseDownEv = <MouseDownEventPositions>{};
        let _this = this;

        el.addEventListener("mousedown", function (event) {
            if (_this.isMinimized) {
                return;
            }
            event.preventDefault();
            clearSelection();
            md.x = event.pageX;
            md.y = event.pageY;
            const rect = _this._domElement.getBoundingClientRect();
            md.top = rect.top;
            md.left = rect.left;
            _this._domElement.classList.add(cssMap.grabbed);
            window.addEventListener("mousemove", repo);
        });

        window.addEventListener("mouseup", function () {
            _this._domElement.classList.remove(cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
        document.addEventListener("mouseleave", function () {
            _this._domElement.classList.remove(cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
    }

    private _repositionEvent(ev) {
        const md = this.mouseDownEv,
            dx = ev.pageX - md.x,
            dy = ev.pageY - md.y,
            newX = md.left + dx,
            newY = md.top + dy,
            de = this._domElement,
            rect = de.getBoundingClientRect();

        if (newX > 0 && (newX + rect.width) < window.innerWidth) {
            de.style.left = newX + "px";
        }
        if (newY > 0 && (newY + rect.height) < window.innerHeight) {
            de.style.top = newY + "px";
        }
    }
}