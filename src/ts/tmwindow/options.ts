export interface ITmWindowOptions {
    /**
     * Contain the wrapper element in the window
     */
    contain?: boolean;
    /**
     *  remove element from dom when close method gets called
     */
    destroyOnClose?: boolean;
    /**
     *  Make the window resizable (true) or fixed (false)
     */
    resizable?: boolean;
    /**
     *  Custom styles
     */
    style?: object;
    /**
     *  Window title
     */
    title?: string;
}

const defaultOptions: ITmWindowOptions = {
    contain: true,
    destroyOnClose: false,
    resizable: true,
    style : {},
    title: "",
};

export {defaultOptions};
