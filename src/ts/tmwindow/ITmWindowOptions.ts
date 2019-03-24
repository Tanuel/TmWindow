/**
 * Options available to be set with TmWindow.setOption()
 */
export interface ITmWindowOptions {
    /**
     * An additional class name for the window dom element
     */
    className?: string;
    /**
     * Contain the wrapper element in the window
     */
    contain?: boolean;
    /**
     * Window content. Can be a string (added as innerHTML) or HTMLElement (appended to content element)
     */
    content?: string | HTMLElement;
    /**
     * Height of the Window.
     * If a number is passed, it will be treated as a pixel value.
     */
    height?: string|number;
    /**
     * A unique id for the window dom element
     */
    id?: string;
    /**
     *  remove element from dom when close method gets called
     */
    removeOnClose?: boolean;
    /**
     *  Make the window resizable (true) or fixed (false)
     */
    resizable?: boolean;
    /**
     *  Custom styles
     */
    style?: object;
    /**
     *  Window title. Can be a string (added as innerHTML) or HTMLElement (appended to title element)
     */
    title?: string | HTMLElement;
    /**
     * Width of the window.
     * If a number is passed, it will be treated as a pixel value.
     */
    width?: string | number;
}
