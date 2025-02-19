// ==UserScript==
// @name         Custom QuickRef Sidebar
// @namespace    http://tampermonkey.net/
// @version      2025-02-19
// @description  Creates sidebar to quickref.me
// @author       Shailendra Kumar
// @match        https://quickref.me/*
// @exclude      https://quickref.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quickref.me
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const originalContent = document.querySelector('body > div');
  const originalHeader = document.querySelector('header');

  const originalcontentContainer = document.createElement('div');
  originalcontentContainer.classList.add('modified-content');
  originalcontentContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    `;

  originalcontentContainer.appendChild(originalHeader);
  originalcontentContainer.appendChild(originalContent);

  const customContainer = document.createElement('div');
  customContainer.classList.add('customContainer');
  customContainer.style.cssText = `
    display: flex;
    align-items: stretch;
    `;

  const startSidebarMinWidth = '40';
  const hoverSidebarMinWidth = '140';
  const customSidebar = document.createElement('div');
  customSidebar.classList.add('custom-sidebar', 'home');
  customSidebar.style.cssText = `
    min-width: ${startSidebarMinWidth};
    max-width: ${startSidebarMinWidth};
    min-height: 100vh;
    max-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transition: min-width 0.2s linear, max-width 0.2s linear;
    overflow-y: auto;
    padding: 4px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    `;

  const fillerSidebar = customSidebar.cloneNode(true);
  fillerSidebar.classList.add('custom-filler-sidebar');

  customContainer.appendChild(fillerSidebar);
  customContainer.appendChild(originalcontentContainer);

  document.body.insertAdjacentElement('afterbegin', customContainer);

  const style = document.createElement('style');
  style.textContent = `
    .custom-sidebar.home,
    .custom-filler-sidebar {
    background-color: inherit;
    min-width: ${startSidebarMinWidth}px;
    max-width: ${startSidebarMinWidth}px;
    opacity: 0.25
    }

    .custom-sidebar.home:hover,
    body:has(.custom-sidebar.home:hover) .custom-filler-sidebar {
    opacity: 1;
    min-width: 20vw;
    max-width: 20vw;
    }

    .custom-sidebar.home:hover {
    border-right: 2px solid #d1d5d9;
    }

    .active-tab {
    outline: 2px solid #fafafa;
    }

    .custom-filler-sidebar {
    position: relative !important;
    background-color: transparent !important;
    }

    .dark .custom-sidebar.home:hover {
    border-right: 2px solid #0a1024;
    }

    .sidebar-card-header {
    display: block !important;
    color: black !important;
    background: #ffffff10 !important;
    cursor: default !important;
    margin: 0;
    border-radius: 0 !important;
    margin-bottom: 1em;
    padding: 4px !important;
    text-align: center !important;
    }

    .dark .sidebar-card-header {
    color: white !important;
    }

    .sidebar-custom-hr {
    margin: 1em;
    border: none;
    border-top: 2px dotted #ffffff80;
    }

    .custom-card-container {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .custom-sidebar.home:hover .custom-card-container {
        justify-content: center;
    }


    .home .card {
	transition-duration: 100ms;
	animation-name: enter;
	--tw-enter-opacity: initial;
	--tw-enter-scale: initial;
	--tw-enter-rotate: initial;
	--tw-enter-translate-x: initial;
	--tw-enter-translate-y: initial;
	--tw-enter-opacity: 0;
	animation-duration: 100ms;
	position: relative;
	display: flex;
	cursor: pointer;
	align-items: center;
	border-radius: 0.5rem;
	--tw-bg-opacity: .65;
	padding: 1rem;
	color: rgb(15 23 42/0.9);
	--tw-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
	--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
	box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
}

.home .card > p {
	margin-left: 0.5rem;
	max-width: 75%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.home .card:hover {
	--tw-bg-opacity: 1;
	color: rgb(241 245 249/0.9);
	--tw-shadow: 0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);
	--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),0 10px 10px -5px var(--tw-shadow-color);
}

.bg-\[\#4aa181\] {
	--tw-bg-opacity: 1;
}
`;
  style.id = 'custom-sidebar-sk';

  const currentLocation = window.location.href;

  fetch(
    'https://raw.githubusercontent.com/softwaredev-sk/quickref-custom-sidebar/refs/heads/main/quickref.json'
  )
    .then((res) => res.json())
    .then((data) => {
      for (let [key, value] of Object.entries(data)) {
        const header = document.createElement('h2');
        header.classList.add('card', 'sidebar-card-header');
        header.textContent = key;
        header.style.cssText = `
        white-space: nowrap;
        text-transform: uppercase;
        text-align: center;
        max-width: 100%;
        `;
        customSidebar.appendChild(header);

        const content = document.createElement('div');
        content.classList.add('custom-card-container');

        value.forEach((ref) => {
          const refNode = document.createElement('a');
          refNode.href = ref.link;
          refNode.style.backgroundColor = ref.cardClass
            .split('[')
            .at(-1)
            .slice(0, -1);
          refNode.style.cssText = `
            color: inherit;
            margin-bottom: 2px;
            display: block;
            text-align: center;
            min-width: 60px;
            width: calc(50% - 10px);
            `;
          const div = document.createElement('div');
          div.className = ref.cardClass;
          const p = document.createElement('p');
          p.textContent = ref.title;
          p.style.whiteSpace = 'nowrap';
          refNode.appendChild(div);
          div.appendChild(p);
          content.appendChild(refNode);
          if (ref.link === currentLocation) {
            div.classList.add('active-tab');
          }
        });
        customSidebar.appendChild(content);

        const hr = document.createElement('hr');
        hr.classList.add('sidebar-custom-hr');
        customSidebar.appendChild(hr);
      }
    });

  document.body.appendChild(customSidebar);
  document.head.appendChild(style);
})();
