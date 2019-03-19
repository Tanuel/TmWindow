/**
 * Type declaration for the css map
 */
export interface ITmWindowCssMap {
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
/**
 * Object with css class names to be used to identify the window
 */
declare const cssMap: ITmWindowCssMap;
export { cssMap };
