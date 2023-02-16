import { API_URL } from '../config/config.js';

class LoginForm extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {

        this.shadow.innerHTML = 
        `
        <style>

            form{
                width: 100%;
            }

            .form-element{
                margin-bottom: 1em;
                width: 100%;
            }

            .form-element-label{
                margin-bottom: 0.5em;
            }

            .form-element-label label{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
                transition: color 0.5s;
            }

            .form-element-input{
                width: 100%;
            }

            .form-element-input input{
                background-color:hsl(226, 63%, 45%);
                border: none;
                border-bottom: 0.1em solid  hsl(0, 0%, 100%);
                box-sizing: border-box;
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                padding: 0.2em;
                width: 100%;
            }

            .form-submit{
                background-color: transparent;
                border-radius: 1em;
                border: 0.2rem solid white;
                color: white;
                cursor: pointer;
                float: right;
                font-size: 1.2em;
                font-weight: 600;
                letter-spacing: 0;
                line-height: 0px;
                margin-top: 1em;
                min-width: 20%;
                padding: 1em 2em;
                transition: 0.5s;
                text-decoration: none;
            }
        </style>
        <form class="form">
            <div class="form-element">
                <div class="form-element-label">
                    <label for="email">Email</label>
                </div>
                <div class="form-element-input">
                    <input type="email" name="email" id="email" required>
                </div>
            </div>
            <div class="form-element">
                <div class="form-element-label">
                    <label for="password">Password</label>
                </div>
                <div class="form-element-input">
                    <input type="password" name="password" id="password" required>
                </div>
            </div>
            <button type="submit" class="form-submit">Enviar</button>
        </form>
        `;

        const form = this.shadow.querySelector('form');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitForm(form);
        }); 
    }

    async submitForm(form) {

        let url = API_URL + this.getAttribute('action');
        let formData = new FormData(form);
        let formDataJson = Object.fromEntries(formData.entries());

        try{
            let result = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataJson)
            });
    
            if (result.ok) {
                let data = await result.json();
                sessionStorage.setItem('accessToken', data.accessToken);
                window.location.href = this.getAttribute('redirection');
            } else {
                let error = await result.json();
                console.log(error.message);
            }
            
        }catch(error){
            console.log(error);
        }
    }
}

customElements.define('login-form', LoginForm);
