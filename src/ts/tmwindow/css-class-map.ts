export interface cssMapInterface {
    wrapper: string,
    wrapperOpen: string,
    wrapperClosed: string,
    wrapperMinimized: string,
    resizable: string,
    grabbed: string,
    header: string,
    title: string,
    headerButtons: string,
    content: string,
    btn: string,
    btnClose: string,
    btnMinimize: string,
}

let wrapper = "tmWindow";
let wrapperOpen = wrapper + "-open";
let wrapperClosed = wrapper + "-closed";
let wrapperMinimized = wrapper + "-minimized";
let resizable = wrapper + '-resizable';
let grabbed = wrapper + "-grabbed";
let header = wrapper + "-header";
let title = wrapper + "-title";
let headerButtons = wrapper + "-buttons";
let content = wrapper + "-content";
let btn = wrapper + "-btn";
let btnClose = btn + ' ' + wrapper + "-btn-close";
let btnMinimize = btn + ' ' + wrapper + "-btn-minimize";

const cssMap: cssMapInterface = {
    wrapper,
    wrapperOpen,
    wrapperClosed,
    wrapperMinimized,
    resizable,
    grabbed,
    header,
    title,
    headerButtons,
    content,
    btn,
    btnClose,
    btnMinimize,
};

export {cssMap}