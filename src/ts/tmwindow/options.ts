export interface IOptions {
    destroyOnClose: boolean;
    resizable: boolean;
    style: object;
    title: string;
}

const defaultOptions: IOptions = {
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
