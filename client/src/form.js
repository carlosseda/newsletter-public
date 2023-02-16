import { API_URL } from '../config/config.js';

class FormBuilder extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.images = [];
    }

    static get observedAttributes() { return ['url']; }

    connectedCallback() {

        document.addEventListener("newUrl",( event =>{
            this.setAttribute('url', event.detail.url);
        }));

        document.addEventListener("showElement",( event =>{
            this.showElement(event.detail.element); 
        }));

        document.addEventListener("refreshForm",( event =>{
            this.render();
        }));

        document.addEventListener("attachImageToForm",( event =>{
            this.attachImageToForm(event.detail.image);
        }));
    }

    async attributeChangedCallback(name, oldValue, newValue){
        this.formStructure = await this.setFormStructure();        
        await this.render();
    }

    render = async () => {

        this.shadow.innerHTML = 
        `
        <style>

            .tabs-container-menu{
                background-color: hsl(100, 100%, 100%);
                display: flex;
                height: 2.5em;
                justify-content: space-between;
                width: 100%;
            }
            
            .tabs-container-menu ul{
                height: 2.5em;
                display: flex;
                margin: 0;
                padding: 0;
            }
            
            .tabs-container-menu li{
                color: hsl(0, 0%, 50%);
                cursor: pointer;
                font-family: 'Roboto' , sans-serif;
                list-style: none;
                font-weight: 600;
                padding: 0.5em;
                text-align: center;
            }
            
            .tabs-container-menu li.active,
            .tabs-container-menu li.active:hover{
                background-color:hsl(207, 85%, 69%);
                color: white;
            }
            
            .tabs-container-buttons{
                display: flex;
                padding: 0 0.5em;
            }

            .tabs-container-buttons svg{
                cursor: pointer;
                height: 2.5rem;
                width: 2.5rem;
                fill: hsl(207, 85%, 69%);
            }

            .tabs-container-buttons svg:hover{
                fill: hsl(19, 100%, 50%);
            }

            .errors-container{
                background-color: hsl(0, 0%, 100%);
                display: none;
                flex-direction: column;
                gap: 1em;
                margin-top: 1em;
                padding: 1em;
            }

            .errors-container.active{
                display: flex;
            }

            .errors-container .error-container{
                width: 100%;
            }

            .errors-container .error-container span{
                color: hsl(0, 0%, 50%);
                font-family: 'Roboto' , sans-serif;
                font-size: 1em;
                font-weight: 600;
            }
            
            .tab-panel{
                display: none;
            }
            
            .tab-panel.active{
                display: block;
                padding: 1em 0;
            }
            
            .row {
                display: flex;
                justify-content: space-between;
                gap: 2em;
            }

            .form-element{
                margin-bottom: 1em;
                width: 100%;
            }
            
            .form-element-label{
                display: flex;
                justify-content: space-between;
                margin-bottom: 1em;
                width: 100%;
            }
            
            .form-element-label label,
            .form-element-label span{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
                transition: color 0.5s;
            }

            .form-element-label label.invalid::after{
                content: '*';
                color: hsl(0, 100%, 50%);
                font-size: 1.5em;
                margin-left: 0.2em;
            }

            .form-element-label,
            .form-element-input{
                width: 100%;
            }

            input[type="submit"]{
                background: none;
                color: inherit;
                border: none;
                padding: 0;
                font: inherit;
                cursor: pointer;
                outline: inherit;
            }
            
            .form-element-input input, 
            .form-element-input textarea,
            .form-element-input select {
                background-color:hsl(226deg 64% 66%);
                border: none;
                border-bottom: 0.1em solid  hsl(0, 0%, 100%);
                box-sizing: border-box;
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                padding: 0.5em;
                width: 100%;
            }

            .form-element-input input:focus,
            .form-element-input textarea:focus,
            .form-element-input select:focus{
                outline: none;
                border-bottom: 0.1em solid hsl(207, 85%, 69%);
            }

            .form-element-input input.invalid,
            .form-element-input textarea.invalid{
                border-bottom: 0.2em solid hsl(0, 100%, 50%);
            }

            .form-element-input textarea{
                height: 10em;
            }

            .form-element-input .checkbox-container,
            .form-element-input .radio-container{
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            .form-element-input .checkbox-container input,
            .form-element-input .radio-container input{
                width: 1em;
                height: 1em;
            }

            .form-element-input .checkbox-container label,
            .form-element-input .radio-container label{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container{
                display: flex;
                align-items: center;
                gap: 0.5em;
            }

            .form-element-input .range-container input{
                width: 100%;
            }

            .form-element-input .range-container label{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container .range-value{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto' , sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container input[type="range"]{
                -webkit-appearance: none;
                width: 100%;
                height: 0.5em;
                border-radius: 0.5em;
                background: hsl(0, 0%, 100%);
                outline: none;
                opacity: 0.7;
                -webkit-transition: .2s;
                transition: opacity .2s;
            }

            .form-element-input input[type="time"]::-webkit-calendar-picker-indicator,
            .form-element-input input[type="date"]::-webkit-calendar-picker-indicator{
                filter: invert(1);
            }
        </style>
        
        <form autocomplete="off">
                                
            <input autocomplete="false" name="hidden" type="text" style="display:none;">

            <div class="tabs-container-menu">
                <div class="tabs-container-items">
                   <ul>
                   </ul>
                </div>

                <div class="tabs-container-buttons">
                    <div id="create-button"> 
                        <svg viewBox="0 0 24 24">
                            <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z" />
                        </svg>
                    </div>
                    <div id="store-button"> 
                        <label>
                            <input type="submit" value="">
                            <svg viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none"/>
                                <path class="crud__create-button-icon" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                            </svg>
                        </label> 
                    </div>
                </div>
            </div>

            <div class="errors-container">

            </div>

            <div class="tabs-container-content"></div>
        </form>
        `;      

        const form = this.shadow.querySelector('form');
        const tabsContainerItems = this.shadow.querySelector('.tabs-container-items ul'); 
        const tabsContainerContent = this.shadow.querySelector('.tabs-container-content'); 

        for(let tab in this.formStructure.tabs) {

            const tabElement = document.createElement('li');
            tabElement.classList.add('tab-item');            
            tabElement.dataset.tab = tab;
            tabElement.innerHTML = this.formStructure.tabs[tab].label;
            tabsContainerItems.append(tabElement);

            const tabPanel = document.createElement('div');
            tabPanel.dataset.tab = tab;
            tabPanel.classList.add('tab-panel');
            tabsContainerContent.append(tabPanel);

            for (let row in this.formStructure.tabsContent[tab].rows) {

                const tabPanelRow = document.createElement('div');
                tabPanelRow.classList.add('row');

                for(let field in this.formStructure.tabsContent[tab].rows[row].formElements) {

                    let formElement = this.formStructure.tabsContent[tab].rows[row].formElements[field];

                    const formElementContainer = document.createElement('div');
                    const formElementLabel = document.createElement('div');
                    const formElementInput = document.createElement('div');
                    formElementContainer.append(formElementLabel);
                    formElementContainer.append(formElementInput);
        
                    formElementContainer.classList.add('form-element');
                    formElementLabel.classList.add('form-element-label');
                    formElementInput.classList.add('form-element-input');
        
                    if(formElement.label){
                        const label = document.createElement('label');
                        label.innerText = formElement.label;
                        label.setAttribute('for', field);
                        formElementLabel.append(label);
                    }
     
                    if (formElement.element === 'input') {
        
                        switch (formElement.type) {

                            case 'hidden': {

                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.value = formElement.value || '';

                                form.append(input);

                                continue;
                            }

                            case 'checkbox':
                            case 'radio': {
        
                                const inputContainer = document.createElement('div');
                                inputContainer.classList.add(`${formElement.type}-container`);
                
                                formElement.options.forEach(option => {
                                    const input = document.createElement('input');
                                    const inputLabel = document.createElement('label');
                                    inputLabel.innerText = option.label;
                                    input.id = field;
                                    input.type = formElement.type;
                                    input.name = field;
                                    input.value = option.value || '';
                                    input.checked = option.checked || false;
                                    input.disabled = option.disabled || false;

                                    inputContainer.append(inputLabel);
                                    inputContainer.append(input);
                                });

                                formElementInput.append(inputContainer);

                                break;
                            }

                            case 'range': {

                                const rangeContainer = document.createElement('div');
                                rangeContainer.classList.add('range-container');
                
                                const input = document.createElement('input');
                                input.id = field;
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.value = formElement.value || '';
                                rangeContainer.append(input);

                                const rangeValue = document.createElement('span');
                                rangeValue.classList.add('range-value');
                                rangeValue.innerText = formElement.value;
                                rangeContainer.append(rangeValue);

                                input.addEventListener('input', () => {
                                    rangeValue.innerText = input.value;
                                });

                                formElementInput.append(rangeContainer);

                                break;
                            }

                            case 'number':
                            case 'date':
                            case 'time':
                            case 'datetime-local':
                            case 'month':
                            case 'week': {
                                const input = document.createElement('input');
                                input.id = field;
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.placeholder = formElement.placeholder || '';
                                input.value = formElement.value || '';
                                input.readOnly = formElement.readOnly || false;
                                input.dataset.validate = formElement.validate || '';

                                formElementInput.append(input);
                            
                                break;
                            }

                            case 'file': {

                                if(!this.shadow.querySelector('image-gallery-component')){
                                    const imageGallery = document.createElement('image-gallery-component');
                                    this.shadow.append(imageGallery);
                                }

                                const input = document.createElement('upload-image-button-component');
                                input.id = field;
                                input.setAttribute("name", field);
                                input.setAttribute("languageAlias", "es");
                                input.setAttribute("quantity", formElement.quantity);

                                // input.accept = formElement.accept || '';
                                // input.multiple = formElement.multiple || false;
                                // input.required = formElement.required || false;
                                // input.dataset.validate = formElement.validate || '';

                                formElementInput.append(input);

                                break;
                            }

                            default: {
                                
                                const input = document.createElement('input');
                                input.id = field;
                                input.type = formElement.type;
                                input.name = field;
                                input.value = formElement.value || '';
                                input.placeholder = formElement.placeholder || '';
                                input.dataset.validate = formElement.validate || '';
                                  
                                if(formElement.maxLength){

                                    input.maxLength = formElement.maxLength || '';
                                    const counter = document.createElement('span');
                                    formElementLabel.append(counter);

                                    input.addEventListener('input', () => {
                                        if(input.value.length > 0){
                                            counter.textContent = input.value.length + ' / ' + input.maxLength;                            
                                        }else{
                                            counter.textContent = '';
                                        }
                                    });
                                }
            
                                formElementInput.append(input);

                                break;
                            }
                        }
                    }

                    if (formElement.element === 'textarea') {

                        const textarea = document.createElement('textarea');
                        textarea.id = field;
                        textarea.name = field;
                        textarea.disabled = formElement.disabled || false;
                        textarea.readOnly = formElement.readOnly || false;
                        textarea.value = formElement.value || '';
                        textarea.cols = formElement.cols || '';
                        textarea.rows = formElement.rows || '';
                        textarea.wrap = formElement.wrap || '';
                        textarea.placeholder = formElement.placeholder || '';
                        textarea.dataset.validate = formElement.validate || '';
                       
                        if(formElement.maxLength){

                            textarea.maxLength = formElement.maxLength || '';
                            const counter = document.createElement('span');
                            formElementLabel.append(counter);

                            textarea.addEventListener('input', () => {
                                if(textarea.value.length > 0){
                                    counter.textContent = textarea.value.length + ' / ' + textarea.maxLength;                            
                                }else{
                                    counter.textContent = '';
                                }
                            });
                        }

                        formElementInput.append(textarea);
                    }
        
                    if (formElement.element === 'select') {
        
                        const select = document.createElement('select');
                        select.id = field;
                        select.name = field;
                        select.disabled = formElement.disabled || false;
                        select.required = formElement.required || false;
                        select.multiple = formElement.multiple || false;
        
                        formElement.options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.innerText = option.label;
                            select.append(optionElement);
                        });
        
                        formElementInput.append(select);
                    }

                    tabPanelRow.append(formElementContainer);

                };

                tabPanel.append(tabPanelRow);

            };

        }
      
        this.renderTabs();
        this.renderSubmitForm();
        this.renderCreateForm();
    }

    renderTabs = () => {

        this.shadow.querySelector(".tab-item").classList.add('active');
        this.shadow.querySelector(".tab-panel").classList.add('active');

        let tabsItems = this.shadow.querySelectorAll('.tab-item');
        let tabPanels = this.shadow.querySelectorAll(".tab-panel");
    
        tabsItems.forEach(tabItem => { 
    
            tabItem.addEventListener("click", () => {
        
                let activeElements = this.shadow.querySelectorAll(".active");
        
                activeElements.forEach(activeElement => {
                    activeElement.classList.remove("active");
                });
                
                tabItem.classList.add("active");
        
                tabPanels.forEach(tabPanel => {
        
                    if(tabPanel.dataset.tab == tabItem.dataset.tab){
                        tabPanel.classList.add("active"); 
                    }
                });
            });
        });
    }

    renderSubmitForm = () => {

        this.shadow.querySelector('#store-button').addEventListener('click', async (event) => {

            event.preventDefault();

            let form = this.shadow.querySelector('form');

            if(!this.validateForm(form.elements)){
                return;
            }

            let formData = new FormData(form);

            if(this.shadow.querySelectorAll('input[type="checkbox"]').length > 0){
                
                this.shadow.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {

                    let checkboxValues = [];

                    this.shadow.querySelectorAll(`input[name="${checkbox.name}"]:checked`).forEach(checkedCheckbox => {
                        checkboxValues.push(checkedCheckbox.value);
                    });
                    
                    formData.append(checkbox.name, checkboxValues);
                });
            }

            let formDataJson = Object.fromEntries(formData.entries());
            let url = formDataJson.id ? `${API_URL}${this.getAttribute('url')}/${formDataJson.id}` : `${API_URL}${this.getAttribute('url')}`;
            let method = formDataJson.id ? 'PUT' : 'POST';
            delete formDataJson.id;

            if(this.images){
                formDataJson.images =  this.images;
            }
            
            let response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
                },
                body: JSON.stringify(formDataJson)
            })

            if(response.status === 200){
                                
                document.dispatchEvent(new CustomEvent('message', {
                    detail: {
                        message: 'Datos guardados correctamente',
                        type: 'success'
                    }
                }));

                this.images = [];
                this.render();
                document.dispatchEvent(new CustomEvent('refreshTable'));
            }

            if(response.status === 500){

                let data = await response.json();

                if(data.errors){

                    data.errors.forEach(error => {

                        let errorContainer = document.createElement('div');
                        let errorMessage = document.createElement('span')
                        errorContainer.classList.add('error-container');
                        errorMessage.textContent = error.message;
                        errorContainer.append(errorMessage);

                        this.shadow.querySelector('.errors-container').append(errorContainer);
                        this.shadow.querySelector('.errors-container').classList.add('active');
                    });
                }

                document.dispatchEvent(new CustomEvent('message', {
                    detail: {
                        message: 'Fallo al guardar los datos',
                        type: 'error'
                    }
                }));  
            }
        });
    }

    renderCreateForm = () => {
        this.shadow.querySelector('#create-button').addEventListener('click', () => {
            this.images = [];
            this.render();
        });
    }

    validateForm = formInputs => {

        let validForm = true;
        
        let validators = {
            "required": {
                "regex": /\S/g,
                "message": "El campo es obligatorio"
            },
            "only-letters": {
                "regex": /^[a-zA-Z\s]+$/g,
                "message": "El campo sólo puede contener letras"
            },
            "only-numbers": {
                "regex": /\d/g,
                "message": "El campo sólo puede contener números"
            },
            "telephone": {
                "regex": /^\d{9}$/g,
                "message": "El campo debe contener 9 números"
            },
            "email": {
                "regex": /\w+@\w+\.\w+/g,
                "message": "El campo debe contener un email válido"
            },
            "password": {
                "regex": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g,
                "message": "El campo debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número"
            },
            "date": {
                "regex": /^\d{4}-\d{2}-\d{2}$/g,
                "message": "El campo debe contener una fecha válida"
            },
            "time": {
                "regex": /^\d{2}:\d{2}$/g,
                "message": "El campo debe contener una hora válida"
            },
            "datetime": {
                "regex": /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/g,
                "message": "El campo debe contener una fecha y hora válida"
            },
            "dni": {
                "regex": /^\d{8}[a-zA-Z]$/g,
                "message": "El campo debe contener un DNI válido"
            },
            "nif": {
                "regex": /^[a-zA-Z]\d{7}[a-zA-Z]$/g,
                "message": "El campo debe contener un NIF válido"
            },
            "cif": {
                "regex": /^[a-zA-Z]\d{7}[a-zA-Z0-9]$/g,
                "message": "El campo debe contener un CIF válido"
            },
            "postal-code": {
                "regex": /^\d{5}$/g,
                "message": "El campo debe contener un código postal válido"
            },
            "credit-card": {
                "regex": /^\d{16}$/g,
                "message": "El campo debe contener una tarjeta de crédito válida"
            },
            "iban": {
                "regex": /^[a-zA-Z]{2}\d{22}$/g,
                "message": "El campo debe contener un IBAN válido"
            },
            "url": {
                "regex": /^(http|https):\/\/\w+\.\w+/g,
                "message": "El campo debe contener una URL válida"
            },
            "ip": {
                "regex": /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g,
                "message": "El campo debe contener una IP válida"
            },
            "mac": {
                "regex": /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/g,
                "message": "El campo debe contener una MAC válida"
            },
            "image": {
                "regex": /\.(gif|jpg|jpeg|tiff|png)$/g,
                "message": "El campo debe contener una imagen válida"
            },
            "video": {
                "regex": /\.(avi|mp4|mov|wmv|flv|mkv)$/g,
                "message": "El campo debe contener un vídeo válido"
            },
            "audio": {
                "regex": /\.(mp3|wav|ogg|flac|aac)$/g,
                "message": "El campo debe contener un audio válido"
            },
            "pdf": {
                "regex": /\.(pdf)$/g,
                "message": "El campo debe contener un PDF válido"
            },
            "doc": {
                "regex": /\.(doc|docx)$/g,
                "message": "El campo debe contener un documento válido"
            },
            "xls": {
                "regex": /\.(xls|xlsx)$/g,
                "message": "El campo debe contener una hoja de cálculo válida"
            },
            "ppt": {
                "regex": /\.(ppt|pptx)$/g,
                "message": "El campo debe contener una presentación válida"
            },
            "zip": {
                "regex": /\.(zip|rar|7z|tar|gz)$/g,
                "message": "El campo debe contener un archivo comprimido válido"
            }
        }
    
        for (let i = 0; i < formInputs.length; i++) {
    
            if (formInputs[i].dataset.validate) {

                formInputs[i].dataset.validate.split(',').forEach((option) => {
                
                    if(formInputs[i].value.match(validators[option].regex) == null) {

                        if(!formInputs[i].classList.contains('invalid')){
                            formInputs[i].classList.add('invalid');
                            formInputs[i].closest('.form-element').querySelector('label').classList.add('invalid');
                            
                            let errorContainer = document.createElement('div');
                            let errorMessage = document.createElement('span');
                            errorContainer.classList.add('error-container');
                            errorMessage.textContent = `${formInputs[i].closest('.form-element').querySelector('label').textContent}: ${validators[option].message}`;
                            errorContainer.append(errorMessage);
    
                            this.shadow.querySelector('.errors-container').append(errorContainer);
                        }

                        validForm = false;

                    }else{
                        formInputs[i].classList.remove('invalid');
                        formInputs[i].closest('.form-element').querySelector('label').classList.remove('invalid');
                    }
                });
            }
        }
    
        if(!validForm){

            this.shadow.querySelector('.errors-container').classList.add('active');

            document.dispatchEvent(new CustomEvent('message', {
                detail: {
                    message: 'Los datos del formulario no son válidos',
                    type: 'error'
                }
            }));
        }
    
        return validForm;
    };

    showElement = element => {

        this.render();
        this.images = [];

        Object.entries(element).forEach(([key, value]) => {

            if(this.shadow.querySelector(`[name="${key}"]`)){

                this.shadow.querySelector(`[name="${key}"]`).value = value;

                if(this.shadow.querySelector(`[name="${key}"]`).tagName == 'SELECT'){

                    let options = this.shadow.querySelector(`[name="${key}"]`).querySelectorAll('option');

                    options.forEach(option => {
                        if(option.value == value){
                            option.setAttribute('selected', true);
                        }
                    });
                }

                if(this.shadow.querySelector(`[name="${key}"]`).type == 'radio'){

                    let radios = this.shadow.querySelector(`[name="${key}"]`).closest('.form-element').querySelectorAll('input[type="radio"]');

                    radios.forEach(radio => {
                        if(radio.value == value){
                            radio.setAttribute('checked', true);
                        }
                    });
                }  

                if(this.shadow.querySelector(`[name="${key}"]`).type == 'checkbox'){

                    let checkbox = this.shadow.querySelectorAll(`[name="${key}"]`);

                    checkbox.forEach(check => {
                        if(check.value == value){
                            check.setAttribute('checked', true);
                        }
                    });
                }
            }

            if(key == 'images'){

                document.dispatchEvent(new CustomEvent('showThumbnails', {
                    detail: {
                        images: value
                    }
                }));
            }
        });
    };

    attachImageToForm = async attachedImage => {
        
        let index = this.images.findIndex(image => 
            image.filename === attachedImage.previousImage && 
            image.languageAlias === attachedImage.languageAlias && 
            image.name === attachedImage.name
        );

        if(index == -1){
            
            this.images.push(attachedImage);

        }else{
            
            if(attachedImage.delete && attachedImage.create){
                this.images.splice(index, 1);
            }

            if(attachedImage.update && attachedImage.create){
                this.images.splice(index, 1);
                this.images[index] = attachedImage;
                delete attachedImage.update;
            }

            else{
                this.images.splice(index, 1);
                this.images[index] = attachedImage;
            }
        }

        console.log(this.images)
    }

    setFormStructure = async () => {
        
        let url = this.getAttribute('url');

        switch (url) {

            case '/api/admin/customers':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        },
                        images: {
                            label: 'Imágenes',
                        }
                    },

                    tabsContent: {
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        name: {
                                            label: 'Nombre',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                        surname: {
                                            label: 'Apellidos',
                                            element: 'input',
                                            type: 'text',
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            validate: 'email'
                                        },
                                        phone: {
                                            label: 'Teléfono',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-numbers'
                                        }
                                    }
                                },
                                row3: {
                                    formElements:{
                                        mobile: {
                                            label: 'Móvil',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-numbers'
                                        },
                                        address: {
                                            label: 'Dirección',
                                            element: 'input',
                                            type: 'text',
                                        }
                                    }
                                },
                                row4: {
                                    formElements:{
                                        province: {
                                            label: 'Provincia',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                        township: {
                                            label: 'Ciudad',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-letters'
                                        },
                                    }
                                },
                                row5: {
                                    formElements:{
                                        postalCode: {
                                            label: 'Código Postal',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'postal-code'
                                        },
                                        startingServiceDate: {
                                            label: 'Fecha de Inicio del Servicio',
                                            element: 'input',
                                            type: 'date',
                                            validate: 'date'
                                        }
                                    }
                                },
                                row6: {
                                    formElements:{
                                        onService: {
                                            label: 'En Servicio',
                                            element: 'select',
                                            options: [
                                                {
                                                    label: 'Sí',
                                                    value: 'true',
                                                },
                                                {
                                                    label: 'No',
                                                    value: 'false',
                                                }
                                            ]
                                        },
                                        identifyNumber: {
                                            label: 'Número de Identificación',
                                            element: 'input',
                                            type: 'number',
                                        }
                                    }
                                },
                                row7: {
                                    formElements:{
                                        comment: {
                                            label: 'Comentario',
                                            element: 'textarea',
                                        }
                                    }
                                },
                                row8: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                    }
                                }
                            }
                        },

                        images: {
                            rows:{
                                row1: {
                                    formElements:{
                                        flyer: {
                                            label: 'Flyer',
                                            element: 'input',
                                            type: 'file',
                                        },
                                    }
                                },
                            }
                        }
                    }
                };    

            case '/api/admin/emails':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        },
                        images: {
                            label: 'Imágenes',
                        }
                    },

                    tabsContent: {
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        subject: {
                                            label: 'Asunto',
                                            element: 'input',
                                            type: 'text',
                                            validate: ["required"]
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        content: {
                                            label: 'Contenido',
                                            element: 'textarea',
                                            validate: ["required"]
                                        }
                                    }
                                },
                            }
                        },

                        images: {
                            rows:{
                                row1: {
                                    formElements:{
                                        flyer: {
                                            label: 'Flyer',
                                            element: 'input',
                                            type: 'file',
                                            quantity: "multiple"
                                        },
                                    }
                                },
                            }
                        }
                    }
                };

            case '/api/admin/ejemplo':

                return {

                    tabs:{
                        main: {
                            label: 'Principal',
                        }
                    },

                    tabsContent: {
                        
                        main: {
                            rows:{
                                row1: {
                                    formElements:{
                                        id:{
                                            element: 'input',
                                            type: 'hidden',
                                        },
                                        name: {
                                            label: 'Nombre',
                                            element: 'input',
                                            maxLength: '10',
                                            type: 'text',
                                            placeholder: '',
                                            required: true,
                                            validate: 'only-letters'
                                        },
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            placeholder: '',
                                            required: true,
                                            validate: 'email'
                                        }
                                    }
                                },
                                row2: {
                                    formElements:{
                                        password: {
                                            label: 'Contraseña',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        },
                                        repeatPassword: {
                                            label: 'Repita la contraseña',
                                            element: 'input',
                                            type: 'password',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row3: {
                                    formElements:{
                                        permissions: {
                                            label: 'Permisos',
                                            element: 'input',
                                            type: 'checkbox',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Crear',
                                                    value: 'create',
                                                    checked: true
                                                },
                                                {
                                                    label: 'Leer',
                                                    value: 'read'
                                                },
                                                {
                                                    label: 'Actualizar',
                                                    value: 'update'
                                                },
                                                {
                                                    label: 'Eliminar',
                                                    value: 'delete'
                                                }
                                            ]
                                        },
                                        sex: {
                                            label: 'Sexo',
                                            element: 'input',
                                            type: 'radio',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Masculino',
                                                    value: "M",
                                                    checked: true
                                                },
                                                {
                                                    label: 'Femenino',
                                                    value: "F"
                                                }
                                            ],
                                        }
                                    }
                                },
                                row4: {
                                    formElements:{
                                        color: {
                                            label: 'Color',
                                            element: 'input',
                                            type: 'color',
                                            placeholder: ''
                                        },
                                        role: {
                                            label: 'Rol',
                                            element: 'select',
                                            required: true,
                                            options: [
                                                {
                                                    label: 'Administrador',
                                                    value: 'admin'
                                                },
                                                {
                                                    label: 'Usuario',
                                                    value: 'user'
                                                }
                                            ]
                                        }
                                    }
                                },
                                row5: {
                                    formElements:{
                                        edad: {
                                            label: 'Edad',
                                            element: 'input',
                                            type: 'number',
                                            placeholder: '',
                                            required: true
                                        },
                                        telefono: {
                                            label: 'Teléfono',
                                            element: 'input',
                                            type: 'tel',
                                            placeholder: '',
                                            required: true
                                        },
                                        url: {
                                            label: 'URL',
                                            element: 'input',
                                            type: 'url',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row6: {
                                    formElements:{
                                        creationDate: {
                                            label: 'Fecha de creación',
                                            element: 'input',
                                            type: 'date',
                                            placeholder: '',
                                            required: true,
                                            validate: 'date'
                                        },
                                        creationTime: {
                                            label: 'Hora de creación',
                                            element: 'input',
                                            type: 'time',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row7: {
                                    formElements:{
                                        reservationWeek: {
                                            label: 'Semana de reserva',
                                            element: 'input',
                                            type: 'week',
                                            placeholder: '',
                                            required: true
                                        },
                                        reservationMonth: {
                                            label: 'Mes de reserva',
                                            element: 'input',
                                            type: 'month',
                                            placeholder: '',
                                            required: true
                                        },
                                        reservationDateTime: {
                                            label: 'Fecha y hora',
                                            element: 'input',
                                            type: 'datetime-local',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row8: {
                                    formElements:{
                                        capital: {
                                            label: 'Capital',
                                            element: 'input',
                                            type: 'range',
                                            min: 0,
                                            max: 100,
                                            step: 1,
                                            value: 50,
                                            placeholder: ''
                                        },
                                    }
                                    
                                },
                                row9: {
                                    formElements:{
                                        pdf: {
                                            label: 'Pdf',
                                            element: 'input',
                                            type: 'file',
                                            placeholder: '',
                                            required: true
                                        },
                                        search: {
                                            label: 'Buscar',
                                            element: 'input',
                                            type: 'search',
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                },
                                row10: {
                                    formElements:{
                                        description: {
                                            label: 'Descripción',
                                            element: 'textarea',
                                            maxLength: 100,
                                            placeholder: '',
                                            required: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
        }
    }
}

customElements.define('form-builder', FormBuilder);
