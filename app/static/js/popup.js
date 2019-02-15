console.log('printed!')

class PopUp extends HTMLElement {
    constructor() {
        super();

        // shadow root
        const shadow = this.attachShadow({mode: 'open'});

        // spans
        const wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');
        const para = document.createElement('p');

        const close = document.createElement('img');
        close.setAttribute('class', 'btn_close');
        close.src = 'assets/gear.svg';
        close.onclick = e => {
            console.log(e);
            this.remove()
        };

        // att. content -> wrapper
        const text = this.getAttribute('text');
        para.textContent = text;

        const style = document.createElement('style')
        style.textContent = `
            .wrapper {
                position: absolute;
                margin: auto;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;

                padding: 10px;
                background-color: white;
                width: 500px;
                height: 300px;
            }

            .btn_close {
                position: relative;
                right: 0;
                float: right;
            }
        `

        // attach elements -> shadow dom
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(close);
        wrapper.appendChild(para);
    }
}

class PopUpYesNo extends PopUp {
    constructor() {
        super();
    }

    
}

// register custom element
customElements.define('popup-info', PopUp)

/* 
- just text
- text & yes/no
- text & line
 */