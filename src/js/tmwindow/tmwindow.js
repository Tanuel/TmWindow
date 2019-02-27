let clearSelection = require("../var/clearSelection");
let create = require("../var/create");
let defaultOptions = require("./options");
let tmwc = require('./css-class-map');

class TmWindow {
    constructor(options = {}) {
        this._options = Object.assign({}, defaultOptions, options);
        // this._headerElement;
        // this._contentElement;
        // this._titleElement;
        this._domElement = this._buildWindow();
        this.resizable = this._options.resizable;
        document.body.appendChild(this._domElement);
    }

    get domElement() {
        return this._domElement;
    }

    setOption(name, value) {
        this._options[name] = value;
    }

    getOption(name) {
        return this._options[name] || '';
    }

    get isOpen() {
        return this._domElement.classList.contains(tmwc.wrapperOpen);
    }

    get isClosed() {
        return this._domElement.classList.contains(tmwc.wrapperClosed);
    }

    get isMinimized() {
        return this._domElement.classList.contains(tmwc.wrapperMinimized);
    }

    set title(title) {
        this._titleElement.innerHTML = title;
        this.setOption('title', title);
    }

    get title() {
        return this._titleElement.innerHTML;
    }

    set resizable(bool) {
        this.setOption('resizable', bool);
        let action = bool ? 'add' : 'remove';
        this._domElement.classList[action](tmwc.resizable);
    }

    set width(width) {
        this._domElement.style.width = width + 'px';
    }

    set x(x) {
        this._domElement.style.left = x + 'px';
    }

    set y(y) {
        this._domElement.style.top = y + 'px';
    }

    set content(content) {
        this._contentElement.innerHTML = content;
    }

    appendElement(element) {
        this._contentElement.appendChild(element);
    }

    setPosition(x, y) {
        this._domElement.style.left = x + 'px';
        this._domElement.style.top = y + 'px';
    }

    open() {
        let de = this._domElement;
        if (this.isMinimized) {
            Object.assign(de.style, this.lastStyles);
        }
        de.classList.remove(tmwc.wrapperClosed, tmwc.wrapperMinimized);
        de.classList.add(tmwc.wrapperOpen);
    }

    close(event) {
        if (this.getOption('destroyOnClose')) {
            this.destroy();
            event.stopImmediatePropagation();
        } else {
            this._domElement.classList.remove(tmwc.wrapperOpen);
            this._domElement.classList.add(tmwc.wrapperClosed);
        }
    }

    destroy() {
        this._domElement.parentNode.removeChild(this._domElement);
    }

    minimize() {
        if (this.isOpen) {
            let de = this._domElement;
            let rect = de.getBoundingClientRect();
            this.lastStyles = {
                top: rect.top + "px",
                left: rect.left + "px",
                height: rect.height + "px",
                width: rect.width + "px"
            };
            de.classList.remove(tmwc.wrapperOpen);
            de.classList.add(tmwc.wrapperMinimized);
            Object.assign(de.style, {
                top: "",
                left: "",
                height: "",
                width: ""
            });
        } else {
            this.open();
        }
    }

    reappend() {
        document.body.appendChild(this._domElement);
    }

    _buildWindow() {
        const wrapper = create("div"),
            header = this._headerElement = this._buildHeader(),
            content = this._contentElement = this._buildContent();

        wrapper.className = tmwc.wrapper + " " + tmwc.wrapperClosed;
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.style.top = "10px";
        wrapper.style.left = "10px";
        Object.assign(wrapper.style, this.getOption("style"));

        wrapper.addEventListener("click", this.reappend.bind(this));
        return wrapper;
    }

    _buildHeader() {
        //_headerElement element
        const header = create("div");
        header.className = tmwc.header;
        //title element
        const title = this._titleElement = create("div");
        title.className = tmwc.title;
        title.innerHTML = this.getOption("title");
        this._addRepositionEvent(title);
        //buttons
        const btns = this._buildHeaderButtons();

        header.appendChild(title);
        header.appendChild(btns);

        return header;
    }

    _buildHeaderButtons() {
        const wrap = create("div");
        wrap.className = tmwc.headerButtons;

        //close button
        const btnClose = this._buildButton(tmwc.btnClose, this.close.bind(this));
        wrap.appendChild(btnClose);

        //minimize button
        const btnMin = this._buildButton(tmwc.btnMinimize, this.minimize.bind(this));
        wrap.appendChild(btnMin);
        return wrap;
    }

    _buildButton(className, callback) {
        const btn = create("button");
        btn.tabIndex = -1;
        btn.className = className;
        btn.addEventListener("click", callback);
        return btn;
    }

    _buildContent() {
        const content = create("div");
        content.className = tmwc.content;
        content.innerHTML = this.getOption("content");
        return content;
    }

    _addRepositionEvent(el) {
        //const repo = function(e){console.log(e);};
        const repo = this._repositionEvent.bind(this);
        let md = this._mouseDownEv = {};
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
            _this._domElement.classList.add(tmwc.grabbed);
            window.addEventListener("mousemove", repo);
        });

        window.addEventListener("mouseup", function () {
            _this._domElement.classList.remove(tmwc.grabbed);
            window.removeEventListener("mousemove", repo);
        });
        document.addEventListener("mouseleave", function () {
            _this._domElement.classList.remove(tmwc.grabbed);
            window.removeEventListener("mousemove", repo);
        });
    }

    _repositionEvent(ev) {
        const md = this._mouseDownEv,
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

module.exports = TmWindow;