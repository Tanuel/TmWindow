"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrapper = "tmWindow";
var wrapperOpen = wrapper + "-open";
var wrapperClosed = wrapper + "-closed";
var wrapperMinimized = wrapper + "-minimized";
var resizable = wrapper + "-resizable";
var grabbed = wrapper + "-grabbed";
var header = wrapper + "-header";
var title = wrapper + "-title";
var headerButtons = wrapper + "-buttons";
var content = wrapper + "-content";
var btn = wrapper + "-btn";
var btnClose = btn + " " + wrapper + "-btn-close";
var btnMinimize = btn + " " + wrapper + "-btn-minimize";
/**
 * Object with css class names to be used to identify the window
 */
var cssMap = {
    btn: btn,
    btnClose: btnClose,
    btnMinimize: btnMinimize,
    content: content,
    grabbed: grabbed,
    header: header,
    headerButtons: headerButtons,
    resizable: resizable,
    title: title,
    wrapper: wrapper,
    wrapperClosed: wrapperClosed,
    wrapperMinimized: wrapperMinimized,
    wrapperOpen: wrapperOpen,
};
exports.cssMap = cssMap;
