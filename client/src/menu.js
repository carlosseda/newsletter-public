import { API_URL } from '../config/config.js';

class Menu extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.menuItems = [];
    }

    connectedCallback() {
        this.loadData().then(() => this.render());
    }

    async loadData() {

        let url = `${API_URL}/api/admin/menus/display/${this.getAttribute("menu")}`;

        try{

            let response = await fetch(url, { 
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken'),
                }
            });
    
            let data = await response.json();
            this.menuItems =  Object.values(data);
            
        }catch(error){
            console.log(error);
        }
    }

    render() {

        this.shadow.innerHTML = 
        `
        <style>
            #menu-button{
                cursor:pointer;
                height: 2em;
                margin-left: auto;
                position: relative;
                width: 2em;
                z-index: 1200;
            }
            #menu-button button{
                background: none;
                border: none;
                color: inherit;
                cursor:pointer;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                outline: inherit;
                padding: 0;
            }

            #menu-button button:before, #menu-button button:after,
            #menu-button span:before, #menu-button span:after{
                background-color: hsl(0, 0%, 100%);
                border-radius: 15px;
                content: "";
                display: block;
                height: 0.2em;
                opacity: 1;
                position: absolute;
                transition: ease-in-out all 0.15s;
                width: 100%
            }

            span:before, span:after{
                top: 50%;
                transform: translateY(-50%);
            }

            #menu-button button:before{
                top: 0.5em;
            }

            #menu-button button:after{
                bottom: 0.5em;
            }

            #menu-button.active button:before, #menu-button.active button:after{
                display: none;
            }

            #menu-button.active span:before{
                background-color: hsl(207, 85%, 69%);
                transform: rotate(45deg);
            }

            #menu-button.active span:after{
                background-color: hsl(207, 85%, 69%);
                transform: rotate(-45deg)
            }

            #menu{
                background-color: hsl(0, 0%, 100%);
                height: 100vh;
                left: 0;
                position: fixed;
                transition: opacity 0.4s;
                top: 0;
                opacity: 0;
                padding: 5%;
                width: 100%;
                z-index: -1;
            }

            #menu.active{
                opacity: 1;
                z-index: 1000;
            }

            nav {
                display: flex;
                align-items: center;
                justify-content: left;
            }
              
            nav ul {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column; 
            }
              
            nav ul li {
                position: relative;
                width: max-content;
            }
              
            nav ul li a {
                display: block;
                font-family: 'Roboto', sans-serif;
                font-size: 1.5em;
                padding: 0.5rem;
                text-decoration: none;
                color: hsl(207, 85%, 69%);
            }

            nav ul li a:hover {
                color: hsl(19, 100%, 50%);
            }

            nav ul li .sub-menu {
                display: none;
            }
            
            nav ul li:hover .sub-menu {
                display: block;
            }
              
            nav ul li:hover > .sub-menu {
                visibility: visible;
                animation: slide-in 0.5s ease-in-out; /* animación de apertura */
            }
              
            .sub-menu {
                position: absolute;
                top: 0;
                left: 100%; 
                visibility: hidden;
                animation: slide-out 0.5s ease-in-out;
            }
        </style>

        <div id="menu-button">
            <button>
                <span></span>
            </button>
        </div>

        <div id="menu">
            <nav>
                <ul>
              
                </ul>
            </nav>
        </div>`;	

        let menuList = this.shadow.querySelector('ul');

        this.menuItems.forEach(menuItem => {

            let li = document.createElement('li');
            let link = document.createElement('a');

            link.setAttribute("href", menuItem.customUrl);
            link.textContent = menuItem.name;

            li.appendChild(link);

            this.createSubMenu(menuItem, li); 

            menuList.appendChild(li);
        });

        this.shadow.querySelectorAll('a').forEach(link => {

            link.addEventListener("click", (event) => {

                event.preventDefault();

                menuButton.classList.toggle('active');
                menu.classList.toggle('active');
    
                document.dispatchEvent(new CustomEvent('newUrl', {
                    detail: {
                        url: link.getAttribute("href"),
                        title: link.textContent,
                    }
                }));
            });
        });

        let menuButton = this.shadow.querySelector('#menu-button');
        let menu = this.shadow.querySelector('#menu');

        menuButton.addEventListener("click", (event) => {
            menuButton.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }

    createSubMenu(menuItem, li) {

        if (menuItem.children) {
    
            let subMenu = document.createElement('ul');
            subMenu.classList.add('sub-menu');
            li.append(subMenu);
    
            Object.values(menuItem.children).forEach(subMenuItem => {
    
                let subLi = document.createElement('li');
                let subLink = document.createElement('a');
    
                subLink.setAttribute("href", subMenuItem.customUrl);
                subLink.textContent = subMenuItem.name;
    
                subLi.appendChild(subLink);
                subMenu.appendChild(subLi);
    
                this.createSubMenu(subMenuItem, subLi); 
            });
    
            li.appendChild(subMenu);
        }
    }
}

customElements.define('menu-component', Menu);
