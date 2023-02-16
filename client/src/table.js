import { API_URL } from '../config/config.js';

class Table extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.data = [];
        this.total;
        this.currentPage;
        this.lastPage;
    }

    static get observedAttributes() { return ['url']; }

    connectedCallback() {

        document.addEventListener("newUrl",( event =>{
            this.setAttribute('url', event.detail.url);
        }));

        document.addEventListener("refreshTable",( event =>{
            this.loadData().then(() => this.render());
        }));

        document.addEventListener("newFilter",( event =>{

            this.data = event.detail.rows;
            this.total = event.detail.total;
            this.currentPage = event.detail.currentPage;
            this.lastPage = event.detail.lastPage;

            this.render();
        }));
    }

    async attributeChangedCallback(name, oldValue, newValue){
        this.tableStructure = await this.setTableStructure();        
        await this.loadData();
        await this.render();
    }

    async loadData() {

        let url = API_URL + this.getAttribute('url');

        try{

            let response = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
                }
            }) 
    
            let data = await response.json();
            this.data = data.rows;
            this.total = data.meta.total;
            this.currentPage = data.meta.currentPage;
            this.lastPage = data.meta.pages;

        }catch(error){
            console.log(error);
        }
    }

    async render() {

        this.shadow.innerHTML = 
        `
        <style>
            .table {
                width: 100%;
            }

            .table .table-row {
                background-color: hsl(226deg 64% 66%);
                box-shadow: 0 0 0.5em hsl(0deg 0% 0% / 0.5);
                margin-bottom: 1em;
            }

            .table-row ul {
                margin: 0;
                padding: 0.5em; 
            }

            .table-row ul li{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto', sans-serif;
                list-style: none;
            }

            .table-row .table-data-header{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto', sans-serif;
                font-weight: 700;
                margin-right: 0.5em;
            }

            .table-row .table-data-header::after {
                content: ":";
                margin-left: 0.3em;
            }

            .table-row .table-buttons{
                background-color: hsl(207, 85%, 69%);
                display: flex;
                justify-content: right;
                gap: 0.5rem;
            }

            .table-row .table-buttons svg {
                cursor: pointer;
                height: 2em;
                width: 2em;
            }

            .table-row .table-buttons svg path {
                fill: hsl(0, 0%, 100%);
            }

            .table-row .table-buttons svg:hover path {
                fill: hsl(19, 100%, 50%);
            }

            .table-pagination {
                margin-top: 1em;
            }
           
            .table-pagination .table-pagination-info{
                color: hsl(0, 0%, 100%);
                display: flex;
                font-family: 'Roboto', sans-serif;
                justify-content: space-between;
            }

            .table-pagination .table-pagination-buttons p{
                color: hsl(0, 0%, 100%);
                font-family: 'Roboto', sans-serif;
                margin: 1rem 0;
            }

            .table-pagination-info p{
                margin: 0;
            }
        
            .table-pagination .table-pagination-button{
                cursor: pointer;
                margin-right: 1em;
            }
        
            .table-pagination .table-pagination-button:hover{
                color: hsl(19, 100%, 50%);
            }
        
            .table-pagination .table-pagination-button.inactive{
                color: hsl(0, 0%, 69%);
            }
        </style>

        <div class="table">
        </div>
        
        <div class="table-pagination">
            <div class="table-pagination-info">
                <div class="table-pagination-total"><p><span id="total-page">${this.total}</span> registros</p></div>
                <div class="table-pagination-pages"><p>Página <span id="current-page">${this.currentPage}</span> de <span id="last-page">${this.lastPage}</span></p></div>
            </div>
            <div class="table-pagination-buttons">
                <p>
                    <span class="table-pagination-button" id="firstPageUrl">Primera</span>
                    <span class="table-pagination-button" id="previousPageUrl">Anterior</span>
                    <span class="table-pagination-button" id="nextPageUrl">Siguiente</span>
                    <span class="table-pagination-button" id="lastPageUrl">Última</span>
                </p>
            </div>
        </div>`;   

        await this.getTableData()
        await this.renderTableButtons();
        await this.renderPaginationButtons();
    }

    async getTableData() {

        let table = this.shadow.querySelector('.table');
        
        this.data.forEach(element => {

            let tableRow = document.createElement('div');
            tableRow.classList.add('table-row');

            let tableButtons = document.createElement('div');
            tableButtons.classList.add('table-buttons');
            tableRow.appendChild(tableButtons);

            let tableRowData = document.createElement('ul');
            tableRowData.classList.add('table-row-data');
            tableRow.appendChild(tableRowData);

            Object.keys(this.tableStructure.headers).forEach( key => {

                let tableElementData = document.createElement('li');
                let tableDataHeader = document.createElement('span');

                tableDataHeader.classList.add('table-data-header');
                tableDataHeader.innerHTML = this.tableStructure.headers[key].label;
                tableElementData.appendChild(tableDataHeader);

                if(element[key]){
                    tableElementData.textContent = element[key];
                }

                tableRowData.appendChild(tableElementData);
            });

            Object.keys(this.tableStructure.buttons).forEach((key) => {

                let tableButton = document.createElement('div');
                tableButton.classList.add('table-button');

                if(key == 'edit'){
                    tableButton.classList.add('edit-button');
                    tableButton.dataset.id = element.id;
                    tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                        </svg>`;
                }

                if(key == 'remove'){
                    tableButton.classList.add('remove-button');
                    tableButton.dataset.id = element.id;
                    tableButton.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                        </svg>`;
                }

                tableButtons.appendChild(tableButton);
            });

            table.append(tableRow);
        });
    }    

    async renderTableButtons() {

        let editButtons = this.shadow.querySelectorAll(".edit-button");
        let removeButtons = this.shadow.querySelectorAll(".remove-button");

        editButtons.forEach(editButton => {

            editButton.addEventListener("click", () => {

                let url = API_URL + this.getAttribute('url') + '/' + editButton.dataset.id;

                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
                    }
                }).then(response => {
                    return response.json();
                }).then(data => {
                    document.dispatchEvent(new CustomEvent('showElement', {
                        detail: {
                            element: data,
                        }
                    }));
                }).catch(error => {
                    console.log(error);
                });
            });
        });

        removeButtons.forEach(removeButton => {

            removeButton.addEventListener("click", () => {

                let url = API_URL + this.getAttribute('url') + '/' + removeButton.dataset.id;

                document.dispatchEvent(new CustomEvent('showOverlayer'));
                document.dispatchEvent(new CustomEvent('showDeleteModal', {
                    detail: {
                        url: url
                    }
                }));
            });
        });
    }

    async renderPaginationButtons() {

        let tablePaginationButtons = this.shadow.querySelectorAll(".table-pagination-button");

        tablePaginationButtons.forEach(tablePaginationButton => {

            tablePaginationButton.addEventListener("click", () => {

                let page;

                switch(tablePaginationButton.id){

                    case 'firstPageUrl':
                        page = 1;
                        break;

                    case 'previousPageUrl':
                        if(this.currentPage == 1) return;
                        page = parseInt(this.currentPage) - 1;
                        break;

                    case 'nextPageUrl':
                        if(this.currentPage == this.lastPage) return;
                        page = parseInt(this.currentPage) + 1;
                        break;

                    case 'lastPageUrl':
                        page = this.lastPage;
                        break;
                }

                this.setAttribute('url', `${this.url}?page=${page}`);
                this.setAttribute('currentPage', page);
            });

        });

    }

    setTableStructure() {

        let url = this.getAttribute('url');

        switch (url) {

            case '/api/admin/customers':

                return {
                    headers:{
                        email: {
                            label: 'Email',
                        },
                        name: {
                            label: 'Nombre',
                        },
                        surname: {
                            label: 'Apellidos',
                        },
                    },
                    buttons: {
                        edit: true,
                        remove: true
                    }
                };

            case '/api/admin/emails':

                return {
                    headers:{
                        subject: {
                            label: 'Asunto',
                        }
                    },
                    buttons: {
                        edit: true,
                        remove: true
                    }
                };
        }
    }
}

customElements.define('table-component', Table);
