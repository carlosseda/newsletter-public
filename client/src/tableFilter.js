import { API_URL } from '../config/config.js';

class TableFilter extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.formStructure = this.setFormStructure();
    }

    static get observedAttributes() { return ['url']; }

    connectedCallback() {

        document.addEventListener("newUrl",( event =>{
            this.setAttribute('url', event.detail.url);
        }));
    }

    async attributeChangedCallback(name, oldValue, newValue){
        this.formStructure = await this.setFormStructure();        
        await this.render();
    }

    render() {

        this.shadow.innerHTML = 
        `
        <style>

            .table-filter{
                height: max-content;
                margin-bottom: 2em;
                position: relative;
                width: 100%;
            }

            .table-filter.active .table-filter-container{
                max-height: 70vh;
            }

            .table-filter-container{
                max-height: 0;
                margin: 0 auto;
                overflow: hidden;
                transition: max-height 0.5s;
                width: 100%;
            }

            .table-filter-container form{
                background-color: transparent;
            }

            .table-filter-buttons{
                width: 100%;
            }

            .table-filter-buttons .table-filter-button{
                cursor: pointer;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s;
                width: 100%;
                text-align: center;
            }

            .table-filter-buttons .table-filter-button:hover{
                svg path{
                    fill: hsl(19, 100%, 50%);
                }
            }

            .table-filter-buttons .table-filter-button.active{
                max-height: 2.5rem;
            }

            .table-filter-buttons .table-filter-button.open-filter{
                background-color: hsl(0, 0%, 100%);
            }

            .table-filter-buttons .table-filter-button.apply-filter{
                background-color: hsl(160, 51%, 33%);
            }

            .table-filter-buttons .table-filter-button svg{
                height: 1.5em;
                padding: 0.5em;
                width: 1.5em;
            }

            .table-filter-buttons .table-filter-button.open-filter svg path{
                fill: hsl(207, 85%, 69%);
            }

            .table-filter-buttons .table-filter-button.open-filter svg:hover path{
                fill: hsl(19, 100%, 50%);
            }

            .table-filter-buttons .table-filter-button.apply-filter svg path{
                fill: hsl(0, 0%, 100%);
            }

            .table-filter-buttons .table-filter-button.apply-filter svg:hover path{
                fill: hsl(19, 100%, 50%);
            }

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
                font-family: 'Ubuntu';
                font-size: 0.8em;
                font-weight: 600;
            }
            
            .tab-panel{
                display: none;
            }
            
            .tab-panel.active{
                display: block;
                padding: 0.5em 0;
            }
            
            .row {
                display: flex;
                justify-content: space-between;
                gap: 2em;
            }

            .form-element{
                margin: 1em 0;
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
                font-family: 'Roboto', sans-serif;
                font-weight: 600;
                font-size: 1em;
                transition: color 0.5s;
            }

            .form-element-label label.invalid{
                color: hsl(351deg 88% 64%);
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
                font-family: 'Roboto', sans-serif;
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
                border-bottom: 0.1em solid hsl(0, 100%, 50%);
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
                font-family: 'Roboto', sans-serif;
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
                font-family: 'Roboto', sans-serif;
                font-weight: 600;
                font-size: 1em;
            }

            .form-element-input .range-container .range-value{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto', sans-serif;
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
        
        <div class="table-filter" id="table-filter">
            <div class="table-filter-container">
                <form autocomplete="off">
                                        
                    <input autocomplete="false" name="hidden" type="text" style="display:none;">

                    <div class="tabs-container-menu">
                        <div class="tabs-container-items">
                            <ul></ul>
                        </div>
                    </div>

                    <div class="tabs-container-content"></div>
                </form>
            </div>
            <div class="table-filter-buttons">
                <div class="table-filter-button open-filter active" id="open-filter">
                    <svg viewBox="0 0 24 24">
                        <path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" />
                    </svg>
                </div>
                <div class="table-filter-button apply-filter" id="apply-filter">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 12V19.88C12.04 20.18 11.94 20.5 11.71 20.71C11.32 21.1 10.69 21.1 10.3 20.71L8.29 18.7C8.06 18.47 7.96 18.16 8 17.87V12H7.97L2.21 4.62C1.87 4.19 1.95 3.56 2.38 3.22C2.57 3.08 2.78 3 3 3H17C17.22 3 17.43 3.08 17.62 3.22C18.05 3.56 18.13 4.19 17.79 4.62L12.03 12H12M15 17H18V14H20V17H23V19H20V22H18V19H15V17Z" />
                    </svg>
                </div>
            </div>
        </div>`;      

        const tabsContainerItems = this.shadow.querySelector('.tabs-container-items ul'); 
        const tabsContainerContent = this.shadow.querySelector('.tabs-container-content'); 

        let index = 0;

        for (let tab in this.formStructure.tabs) {

            const tabElement = document.createElement('li');
            tabElement.classList.add('tab-item');

            if(index === 0){
                tabElement.classList.add('active');
            }                

            tabElement.dataset.tab = tab;
            tabElement.innerHTML = this.formStructure.tabs[tab].label;
            tabsContainerItems.appendChild(tabElement);

            const tabPanel = document.createElement('div');
            tabsContainerContent.appendChild(tabPanel);

            for (let row in this.formStructure.tabsContent[tab].rows) {

                tabPanel.dataset.tab = tab;
                tabPanel.classList.add('tab-panel');

                if(index === 0){
                    tabPanel.classList.add('active');
                }

                const tabPanelRow = document.createElement('div');
                tabPanelRow.classList.add('row');

                for (let field in this.formStructure.tabsContent[tab].rows[row].formElements) {

                    let formElement = this.formStructure.tabsContent[tab].rows[row].formElements[field];

                    const formElementContainer = document.createElement('div');
                    const formElementLabel = document.createElement('div');
                    const formElementInput = document.createElement('div');
                    formElementContainer.appendChild(formElementLabel);
                    formElementContainer.appendChild(formElementInput);
        
                    formElementContainer.classList.add('form-element');
                    formElementLabel.classList.add('form-element-label');
                    formElementInput.classList.add('form-element-input');
        
                    if(formElement.label){
                        const label = document.createElement('label');
                        label.innerText = formElement.label;
                        label.setAttribute('for', `${formElement.label}`);
                        formElementLabel.appendChild(label);
                    }
     
                    if (formElement.element === 'input') {
        
                        switch (formElement.type) {

                            case 'checkbox':
                            case 'radio': {
        
                                const inputContainer = document.createElement('div');
                                inputContainer.classList.add(`${formElement.type}-container`);
                
                                formElement.options.forEach(option => {
                                    const input = document.createElement('input');
                                    const inputLabel = document.createElement('label');
                                    inputLabel.innerText = option.label;
                                    input.type = formElement.type;
                                    input.name = field;
                                    input.value = option.value || '';
                                    input.required = formElement.required || false;
                                    input.checked = option.checked || false;
                                    input.disabled = option.disabled || false;

                                    inputContainer.appendChild(inputLabel);
                                    inputContainer.appendChild(input);
                                });

                                formElementInput.appendChild(inputContainer);

                                break;
                            }

                            case 'range': {

                                const rangeContainer = document.createElement('div');
                                rangeContainer.classList.add('range-container');
                
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.value = formElement.value || '';
                                rangeContainer.appendChild(input);

                                const rangeValue = document.createElement('span');
                                rangeValue.classList.add('range-value');
                                rangeValue.innerText = formElement.value;
                                rangeContainer.appendChild(rangeValue);

                                input.addEventListener('input', () => {
                                    rangeValue.innerText = input.value;
                                });

                                formElementInput.appendChild(rangeContainer);

                                break;
                            }

                            case 'number':
                            case 'date':
                            case 'time':
                            case 'datetime-local':
                            case 'month':
                            case 'week': {
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.min = formElement.min || '';
                                input.max = formElement.max || '';
                                input.step = formElement.step || '';
                                input.placeholder = formElement.placeholder || '';
                                input.value = formElement.value || '';
                                input.readOnly = formElement.readOnly || false;
                                input.dataset.validate = formElement.validate || '';

                                formElementInput.appendChild(input);
                            
                                break;
                            }

                            case 'file': {

                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.accept = formElement.accept || '';
                                input.multiple = formElement.multiple || false;
                                input.required = formElement.required || false;
                                input.dataset.validate = formElement.validate || '';

                                formElementInput.appendChild(input);

                                break;
                            }

                            default: {
                                
                                const input = document.createElement('input');
                                input.type = formElement.type;
                                input.name = field;
                                input.value = formElement.value || '';
                                input.placeholder = formElement.placeholder || '';
                                input.required = formElement.required || false;
                                input.dataset.validate = formElement.validate || '';
                                  
                                if(formElement.maxLength){

                                    input.maxLength = formElement.maxLength || '';
                                    const counter = document.createElement('span');
                                    formElementLabel.appendChild(counter);

                                    input.addEventListener('input', () => {
                                        if(input.value.length > 0){
                                            counter.textContent = input.value.length + ' / ' + input.maxLength;                            
                                        }else{
                                            counter.textContent = '';
                                        }
                                    });
                                }
            
                                formElementInput.appendChild(input);

                                break;
                            }
                        }
                    }

                    if (formElement.element === 'textarea') {

                        const textarea = document.createElement('textarea');
                        textarea.name = field;
                        textarea.disabled = formElement.disabled || false;
                        textarea.required = formElement.required || false;
                        textarea.readOnly = formElement.readOnly || false;
                        textarea.value = formElement.value || '';
                        textarea.cols = formElement.cols || '';
                        textarea.rows = formElement.rows || '';
                        textarea.wrap = formElement.wrap || '';
                        textarea.placeholder = formElement.placeholder || '';
                       

                        if(formElement.maxLength){

                            textarea.maxLength = formElement.maxLength || '';
                            const counter = document.createElement('span');
                            formElementLabel.appendChild(counter);

                            textarea.addEventListener('input', () => {
                                if(textarea.value.length > 0){
                                    counter.textContent = textarea.value.length + ' / ' + textarea.maxLength;                            
                                }else{
                                    counter.textContent = '';
                                }
                            });
                        }

                        formElementInput.appendChild(textarea);
                    }
        
                    if (formElement.element === 'select') {
        
                        const select = document.createElement('select');
                        select.name = field;
                        select.disabled = formElement.disabled || false;
                        select.required = formElement.required || false;
                        select.multiple = formElement.multiple || false;
        
                        formElement.options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option.value;
                            optionElement.innerText = option.label;
                            select.appendChild(optionElement);
                        });
        
                        formElementInput.appendChild(select);
                    }

                    tabPanelRow.appendChild(formElementContainer);
                };

                tabPanel.appendChild(tabPanelRow);
            };

            index++;
        }
      
        this.renderTabs();
        this.renderButtons();
    }

    renderTabs = () => {

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

    renderButtons() {

        let openFilterButton = this.shadow.getElementById("open-filter");
        let applyFilterButton = this.shadow.getElementById("apply-filter");
        let tableFilter = this.shadow.getElementById("table-filter");

        openFilterButton.addEventListener( 'click', () => {
            openFilterButton.classList.remove('active');
            applyFilterButton.classList.add('active');
            tableFilter.classList.add('active')
        });

        applyFilterButton.addEventListener("click", async () => {

            let url = API_URL + this.getAttribute('url');
            let form = this.shadow.querySelector('form');
            let formData = new FormData(form);
            let formDataJson = Object.fromEntries(formData.entries());
            let response;

            if(formDataJson.prompt){

                response = await fetch(`${url}/openai-filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
                    },
                    body: JSON.stringify(formDataJson)
                });

            }else{

                let queryString = new URLSearchParams(formData).toString();

                response = await fetch(`${url}?${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
                    }
                });
            }

            if(response.status === 200){
                      
                this.data = await response.json();

                openFilterButton.classList.add('active');
                applyFilterButton.classList.remove('active');
                tableFilter.classList.remove('active');
                form.reset();

                document.dispatchEvent(new CustomEvent('newFilter', {
                    detail: {
                        rows: this.data.rows,
                        total: this.data.meta.total,
                        currentPage: this.data.meta.currentPage,
                        lastPage: this.data.meta.pages
                    }
                }));
            }

            if(response.status === 500){
                console.log('Error en el servidor');
            }
        });
    }

    setFormStructure() {
        
        let url = this.getAttribute('url');

        switch (url) {

            case '/api/admin/customers':

                return {

                    tabs:{
                        filter: {
                            label: 'Filtros de búsqueda',
                        },
                        openAI: {
                            label: 'OpenAI',
                        }
                    },

                    tabsContent: {
                        filter: {
                            rows:{
                                row1: {
                                    formElements:{
                                        email: {
                                            label: 'Email',
                                            element: 'input',
                                            type: 'email',
                                            placeholder: '',
                                            required: true,
                                            validate: 'email'
                                        },
                                        mobile: {
                                            label: 'Móvil',
                                            element: 'input',
                                            type: 'text',
                                            validate: 'only-numbers'
                                        }
                                    }
                                }
                            }
                        },
                        openAI: {
                            rows:{
                                row1: {
                                    formElements:{
                                        prompt: {
                                            label: '¿Qué datos quieres ver?',
                                            element: 'textarea'
                                        }
                                    }
                                }
                            }
                        }
                    }
                };   
                
            case '/api/admin/emails':

                return {

                    tabs:{
                        filter: {
                            label: 'Filtros de búsqueda',
                        }
                    },

                    tabsContent: {
                        filter: {
                            rows:{
                                row1: {
                                    formElements:{
                                        subject: {
                                            label: 'Asunto',
                                            element: 'input',
                                            type: 'text',
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

customElements.define('table-filter', TableFilter);
