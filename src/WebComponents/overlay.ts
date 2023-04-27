class Overlay extends HTMLElement {
    prevPosition: string;
    parentElemRef: HTMLElement;
    realOverlay: HTMLElement;
    connectedCallback() {
        const parentElement = this.parentElement;
        if (parentElement) {
            this.prevPosition = parentElement.style.position;
            this.parentElemRef = parentElement;
            this.realOverlay = document.createElement('div');
            const clientRectInfo = parentElement.getBoundingClientRect();
            this.realOverlay.style.top = `${
                clientRectInfo.top + window.scrollY
            }px`;
            this.realOverlay.style.left = `${
                clientRectInfo.left + window.scrollX
            }px`;
            this.realOverlay.style.width = `${clientRectInfo.width}px`;
            this.realOverlay.style.height = `${clientRectInfo.height}px`;
            this.realOverlay.style.position = 'absolute';
            this.realOverlay.style.backgroundColor = '#a0c5e8b8';
            this.realOverlay.style.zIndex = '100';

            document.body.appendChild(this.realOverlay);
        }
    }

    disconnectedCallback() {
        this.realOverlay.remove();
    }
}
customElements.define('overlay-component', Overlay);
