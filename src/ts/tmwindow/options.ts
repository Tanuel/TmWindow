export interface IOptions {
    contain: boolean;
    destroyOnClose: boolean;
    resizable: boolean;
    style: object;
    title: string;
}

const defaultOptions: IOptions = {
    contain: true,
    // remove element from dom when close method gets called
    destroyOnClose: false,
    // Test if the window is resizable
    resizable: true,
    // custom styles
    style : {},
    // Window title
    title: "",
};

export {defaultOptions};
