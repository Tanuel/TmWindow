"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var tmutil_1 = require("tmutil");
var ITmWindowCssMap_1 = require("./ITmWindowCssMap");
var ITmWindowOptions_1 = require("./ITmWindowOptions");
var TmWindow = /** @class */ (function () {
    function TmWindow(options) {
        if (options === void 0) { options = {}; }
        if (typeof options === "object") {
            this.options = __assign({}, ITmWindowOptions_1.defaultOptions, options);
        }
        else {
            this.options = __assign({}, ITmWindowOptions_1.defaultOptions, { title: options });
        }
        this.domElement = this._buildWindow();
        document.body.appendChild(this.domElement);
    }
    Object.defineProperty(TmWindow.prototype, "isOpen", {
        get: function () {
            return this.domElement.classList.contains(ITmWindowCssMap_1.cssMap.wrapperOpen);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "isClosed", {
        get: function () {
            return this.domElement.classList.contains(ITmWindowCssMap_1.cssMap.wrapperClosed);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "isMinimized", {
        get: function () {
            return this.domElement.classList.contains(ITmWindowCssMap_1.cssMap.wrapperMinimized);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "title", {
        get: function () {
            return this.titleElement.innerHTML;
        },
        set: function (title) {
            this.setOption("title", title);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "width", {
        set: function (width) {
            this.domElement.style.width = width + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "x", {
        set: function (x) {
            this.domElement.style.left = x + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "y", {
        set: function (y) {
            this.domElement.style.top = y + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TmWindow.prototype, "content", {
        set: function (content) {
            this.contentElement.innerHTML = content;
        },
        enumerable: true,
        configurable: true
    });
    TmWindow.prototype.setOption = function (name, value) {
        if (name in this.options) {
            this.options[name] = value;
        }
        switch (name) {
            case "title":
                this.titleElement.innerHTML = value;
                break;
            case "resizable":
                this.domElement.classList.toggle(ITmWindowCssMap_1.cssMap.resizable, !!value);
                break;
            default:
                break;
        }
        return this;
    };
    TmWindow.prototype.getOption = function (name) {
        return name in this.options ? this.options[name] : "";
    };
    TmWindow.prototype.appendElement = function (element) {
        this.contentElement.appendChild(element);
    };
    TmWindow.prototype.setPosition = function (x, y) {
        this.domElement.style.left = x + "px";
        this.domElement.style.top = y + "px";
    };
    TmWindow.prototype.open = function () {
        var de = this.domElement;
        if (this.isMinimized && typeof this.lastStyle === "object") {
            for (var k in this.lastStyle) {
                de.style[k] = this.lastStyle[k];
            }
        }
        de.classList.remove(ITmWindowCssMap_1.cssMap.wrapperClosed, ITmWindowCssMap_1.cssMap.wrapperMinimized);
        de.classList.add(ITmWindowCssMap_1.cssMap.wrapperOpen);
    };
    TmWindow.prototype.close = function (event) {
        if (this.getOption("destroyOnClose")) {
            this.destroy();
            event.stopImmediatePropagation();
        }
        else {
            this.domElement.classList.remove(ITmWindowCssMap_1.cssMap.wrapperOpen);
            this.domElement.classList.add(ITmWindowCssMap_1.cssMap.wrapperClosed);
        }
    };
    TmWindow.prototype.destroy = function () {
        this.domElement.parentNode.removeChild(this.domElement);
    };
    TmWindow.prototype.minimize = function () {
        if (this.isOpen) {
            var de = this.domElement;
            var rect = de.getBoundingClientRect();
            this.lastStyle = {
                height: rect.height + "px",
                left: rect.left + "px",
                top: rect.top + "px",
                width: rect.width + "px",
            };
            de.classList.remove(ITmWindowCssMap_1.cssMap.wrapperOpen);
            de.classList.add(ITmWindowCssMap_1.cssMap.wrapperMinimized);
            de.style.height = "";
            de.style.left = "";
            de.style.top = "";
            de.style.width = "";
        }
        else {
            this.open();
        }
    };
    TmWindow.prototype.reappend = function () {
        document.body.appendChild(this.domElement);
    };
    TmWindow.prototype._buildWindow = function () {
        var wrapper = tmutil_1.create("div");
        var header = this.headerElement = this._buildHeader();
        var content = this.contentElement = this._buildContent();
        wrapper.className = ITmWindowCssMap_1.cssMap.wrapper + " " + ITmWindowCssMap_1.cssMap.wrapperClosed;
        if (this.options.resizable) {
            wrapper.classList.add(ITmWindowCssMap_1.cssMap.resizable);
        }
        wrapper.appendChild(header);
        wrapper.appendChild(content);
        wrapper.style.top = "10px";
        wrapper.style.left = "10px";
        var styles = Object.keys(this.options.style);
        for (var key in styles) {
            wrapper.style[key] = this.options.style[key];
        }
        wrapper.addEventListener("click", this.reappend.bind(this));
        return wrapper;
    };
    TmWindow.prototype._buildHeader = function () {
        // _headerElement element
        var header = tmutil_1.create("div");
        header.className = ITmWindowCssMap_1.cssMap.header;
        // title element
        var title = this.titleElement = tmutil_1.create("div");
        title.className = ITmWindowCssMap_1.cssMap.title;
        title.innerHTML = this.getOption("title");
        this._addRepositionEvent(title);
        // buttons
        var btns = this._buildHeaderButtons();
        header.appendChild(title);
        header.appendChild(btns);
        return header;
    };
    TmWindow.prototype._buildHeaderButtons = function () {
        var wrap = tmutil_1.create("div");
        wrap.className = ITmWindowCssMap_1.cssMap.headerButtons;
        // close button
        var btnClose = this._buildButton(ITmWindowCssMap_1.cssMap.btnClose, this.close.bind(this));
        wrap.appendChild(btnClose);
        // minimize button
        var btnMin = this._buildButton(ITmWindowCssMap_1.cssMap.btnMinimize, this.minimize.bind(this));
        wrap.appendChild(btnMin);
        return wrap;
    };
    TmWindow.prototype._buildButton = function (className, callback) {
        var btn = tmutil_1.create("button");
        btn.tabIndex = -1;
        btn.className = className;
        btn.addEventListener("click", callback);
        return btn;
    };
    TmWindow.prototype._buildContent = function () {
        var content = tmutil_1.create("div");
        content.className = ITmWindowCssMap_1.cssMap.content;
        content.innerHTML = this.getOption("content");
        return content;
    };
    TmWindow.prototype._addRepositionEvent = function (el) {
        var _this = this;
        // const repo = function(e){console.log(e);};
        var repo = this._repositionEvent.bind(this);
        var md = this.mouseDownEv = {};
        el.addEventListener("mousedown", function (event) {
            if (_this.isMinimized) {
                return;
            }
            event.preventDefault();
            tmutil_1.clearSelection();
            md.x = event.pageX;
            md.y = event.pageY;
            var rect = _this.domElement.getBoundingClientRect();
            md.top = rect.top;
            md.left = rect.left;
            _this.domElement.classList.add(ITmWindowCssMap_1.cssMap.grabbed);
            window.addEventListener("mousemove", repo);
        });
        window.addEventListener("mouseup", function () {
            _this.domElement.classList.remove(ITmWindowCssMap_1.cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
        document.addEventListener("mouseleave", function () {
            _this.domElement.classList.remove(ITmWindowCssMap_1.cssMap.grabbed);
            window.removeEventListener("mousemove", repo);
        });
    };
    TmWindow.prototype._repositionEvent = function (ev) {
        var md = this.mouseDownEv;
        var dx = ev.pageX - md.x;
        var dy = ev.pageY - md.y;
        var newX = md.left + dx;
        var newY = md.top + dy;
        var de = this.domElement;
        var rect = de.getBoundingClientRect();
        // check if we should contain the element in the window
        if (!this.options.contain
            || newX > 0 && (newX + rect.width) < window.innerWidth) {
            de.style.left = newX + "px";
        }
        if (!this.options.contain
            || newY > 0 && (newY + rect.height) < window.innerHeight) {
            de.style.top = newY + "px";
        }
    };
    return TmWindow;
}());
exports.default = TmWindow;
