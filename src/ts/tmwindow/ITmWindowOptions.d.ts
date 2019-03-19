/**
 * Options available to be set with TmWindow.setOption()
 */
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
/**
 * Default options used by TmWindow
 */
declare const defaultOptions: ITmWindowOptions;
export { defaultOptions };