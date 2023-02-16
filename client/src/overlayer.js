class Overlayer extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        document.addEventListener('showOverlayer', () => {
            this.shadow.querySelector('.overlayer').classList.add('active');
        });

        document.addEventListener('hideOverlayer', () => {
            this.shadow.querySelector('.overlayer').classList.remove('active');
        });

        this.render();
    }

    render() {
        this.shadow.innerHTML = 
        `
        <style>
            .overlayer {
                background-color: rgba(0, 0, 0, 0.5);
                height: 100%;
                left: 0;
                opacity: 0;
                position: fixed;
                top: 0;
                transition: opacity 0.3s;
                width: 100%;
                z-index: -1;
            }

            .overlayer.active {
                opacity: 1;
                z-index: 1000;
            }
        </style>

        <div class="overlayer"></div>
        `;

        this.shadow.querySelector('.overlayer').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('hideOverlayer'));
        });
    }
}

customElements.define('overlayer-component', Overlayer);
