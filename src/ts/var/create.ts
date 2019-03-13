/**
 * Wrapper function to create a HTMLElement
 * @param name - tag name of the element to create, e.g. div or span
 */
export default function create(name: string): HTMLElement {
    return window.document.createElement(name);
}
