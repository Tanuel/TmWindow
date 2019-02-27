const classMap = {};
let wrap                    = classMap.wrapper = "tmWindow";

classMap.wrapperOpen        = wrap + "-open";
classMap.wrapperClosed      = wrap + "-closed";
classMap.wrapperMinimized   = wrap + "-minimized";
classMap.resizable          = wrap + '-resizable';

classMap.grabbed            = wrap + "-grabbed";
classMap.header             = wrap + "-header";
classMap.title              = wrap + "-title";
classMap.headerButtons      = wrap + "-buttons";
classMap.content            = wrap + "-content";

let btn = classMap.btn      = wrap + "-btn";
classMap.btnClose           = btn + ' ' + wrap + "-btn-close";
classMap.btnMinimize        = btn + ' ' + wrap + "-btn-minimize";


module.exports = classMap;