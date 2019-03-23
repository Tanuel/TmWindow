/**
 * Options available to be set with TmWindow.setOption()
 */
export interface ITmWindowOptions {
    /**
     * Contain the wrapper element in the window
     */
    contain?: boolean;
    /**
     * Window content. Can be a string (added as innerHTML) or HTMLElement (appended to content element)
     */
    content?: string | HTMLElement;
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
}
