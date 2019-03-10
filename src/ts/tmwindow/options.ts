export type optionsType = {
    destroyOnClose: boolean,
    style: object,
    title: string,
    resizable: boolean
}

const defaultOptions: optionsType = {
    //remove element from dom when close method gets called
    'destroyOnClose': false,
    //custom styles
    'style' : {},
    //Window title
    'title': '',
    //Test if the window is resizable
    'resizable': true,
};

export {defaultOptions};