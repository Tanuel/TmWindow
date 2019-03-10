export interface ICssMap {
    btn: string;
    btnClose: string;
    btnMinimize: string;
    content: string;
    grabbed: string;
    header: string;
    headerButtons: string;
    resizable: string;
    title: string;
    wrapper: string;
    wrapperClosed: string;
    wrapperOpen: string;
    wrapperMinimized: string;
}

const wrapper = "tmWindow";
const wrapperOpen = wrapper + "-open";
const wrapperClosed = wrapper + "-closed";
const wrapperMinimized = wrapper + "-minimized";
const resizable = wrapper + "-resizable";
const grabbed = wrapper + "-grabbed";
const header = wrapper + "-header";
const title = wrapper + "-title";
const headerButtons = wrapper + "-buttons";
const content = wrapper + "-content";
const btn = wrapper + "-btn";
const btnClose = btn + " " + wrapper + "-btn-close";
const btnMinimize = btn + " " + wrapper + "-btn-minimize";

const cssMap: ICssMap = {
    btn,
    btnClose,
    btnMinimize,
    content,
    grabbed,
    header,
    headerButtons,
    resizable,
    title,
    wrapper,
    wrapperClosed,
    wrapperMinimized,
    wrapperOpen,
};

export {cssMap};
