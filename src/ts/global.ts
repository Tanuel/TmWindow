import TmWindow from './tmwindow/tmwindow';

declare global {
    interface Window {
        TmWindow: typeof TmWindow

    }
}

window.TmWindow = TmWindow;

export default TmWindow