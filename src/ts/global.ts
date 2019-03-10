import TmWindow from "./tmwindow/TmWindow";

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        TmWindow: typeof TmWindow;

    }
}

window.TmWindow = TmWindow;

export default TmWindow;
