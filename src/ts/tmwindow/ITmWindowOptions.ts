/**
 * Options available to be set with TmWindow.setOption()
 */
export interface ITmWindowOptions {
    /**
     * Contain the wrapper element in the window
     */
    contain?: boolean;
    /**
     * Window content. Can be a string (added as innerHTML) or HTMLElement (appended to body)
     */
    content?: string | HTMLElement;
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
