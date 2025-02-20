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

const pinDataUri = `data:image/svg+xml,%3Csvg stroke='currentColor' fill='aqua' stroke-width='0' viewBox='0 0 16 16' height='200px' width='200px' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146'%3E%3C/path%3E%3C/svg%3E`;
const unpinnedDataUri = `data:image/svg+xml,%3Csvg stroke='currentColor' fill='aqua' stroke-width='0' viewBox='0 0 16 16' height='200px' width='200px' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z'%3E%3C/path%3E%3C/svg%3E`;

(function () {
  'use strict';

  const originalContent = document.querySelector('body > div');
  const originalHeader = document.querySelector('header');
  const originalFooter = document.querySelector('footer');

  const originalcontentContainer = document.createElement('div');
  originalcontentContainer.classList.add('modified-content');
  originalcontentContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    `;

  originalcontentContainer.appendChild(originalHeader);
  originalcontentContainer.appendChild(originalContent);
  originalcontentContainer.appendChild(originalFooter);

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
  // customSidebar.style.cssText = `
  // min-width: ${startSidebarMinWidth};
  // max-width: ${startSidebarMinWidth};
  // min-height: 100vh;
  // max-height: 100vh;
  // position: fixed;
  // left: 0;
  // top: 0;
  // bottom: 0;
  // transition: min-width 0.2s linear, max-width 0.2s linear;
  // overflow-y: auto;
  // padding: 4px;
  // margin-left: auto;
  // margin-right: auto;
  // display: flex;
  // flex-direction: column;
  // `;

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
    opacity: 0.5;
    }

    .custom-sidebar.home:hover,
    body:has(.custom-sidebar.home:hover) .custom-filler-sidebar,
    .custom-sidebar:has(input:focus),
    body:has(.custom-sidebar input:focus) .custom-filler-sidebar,
    .custom-sidebar.pinned,
    body:has(.custom-sidebar.pinned) .custom-filler-sidebar {
    opacity: 1;
    min-width: 20vw;
    max-width: 20vw;
    }

    .custom-sidebar.pinned {
    border-color: #00000020 !important;
    }

    .dark .custom-sidebar.pinned {
    border-color: #ffffff20 !important;
    }


    .custom-sidebar input {
    outline: 1px solid #d1d5d9;
    border: 1px solid transparent;
    padding: 4px;
    flex: 1 1 auto;
    }

    .dark .custom-sidebar input {
    outline-color: #0a1024;
    }

    .custom-sidebar.home {
    min-height: 100vh;
    max-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    transition: min-width 0.2s linear, max-width 0.2s linear, opacity 0.2s linear, background-color 0.2s linear;
    overflow-y: auto;
    padding: 4px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    border-right: 2px solid transparent;
    }

    .custom-sidebar.home {
    border-right-color: #d1d5d9;
    }

    .dark .custom-sidebar.home {
    border-right-color: #0a1024;
    }

    .active-tab {
    outline: 2px solid #fafafa;
    }

    .custom-filler-sidebar {
    position: relative !important;
    background-color: transparent !important;
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
        white-space: nowrap;
        text-transform: uppercase;
        max-width: 100%;
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

    .custom-sidebar:has(input:focus) .custom-card-container,
    .custom-sidebar.home:hover .custom-card-container,
    .custom-sidebar.pinned .custom-card-container {
        justify-content: center;
    }

    .custom-sidebar .search-container {
    display: flex;
    align-items: center;
    line-height: 1;
    gap: 4px;
    margin-bottom: 6px;
    }

    .custom-sidebar .pin-icon {
    width: 2em;
    height: 2em;
    aspect-ratio: 1;
    object-fit: contain;
    }

    .custom-sidebar .pin-button {
    width: 2em;
    height: 2em;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .custom-sidebar .skill-card {
            color: inherit;
            margin-bottom: 2px;
            display: block;
            text-align: center;
            min-width: 60px;
            width: calc(50% - 10px);
            border-radius: 0.5rem !important;
            overflow: hidden;
    }

    .dark .custom-sidebar .skill-card p {
    color: white !important;
    }


    .dark .custom-sidebar .skill-card:hover {
    filter: brightness(1.25);
    }


    .custom-sidebar.home .card {
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
	border-radius: 0 !important;
	--tw-bg-opacity: .65;
	padding: 1rem;
	color: rgb(15 23 42/0.9);
	--tw-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
	--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
	box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
}

.custom-sidebar.home .card > p {
	margin-left: 0.5rem;
	max-width: 75%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.custom-sidebar.home .card:hover {
	--tw-bg-opacity: 1;
	color: rgb(241 245 249/0.9);
	--tw-shadow: 0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04);
	--tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),0 10px 10px -5px var(--tw-shadow-color);
}

.custom-sidebar .bg-\[\#4aa181\] {
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
          refNode.classList.add('skill-card');
          const div = document.createElement('div');
          div.className = ref.cardClass;
          const p = document.createElement('p');
          p.classList.add('custom-card-identifier');
          p.textContent = ref.title;
          p.style.whiteSpace = 'nowrap';
          refNode.appendChild(div);
          div.appendChild(p);
          content.appendChild(refNode);
          if (ref.link === currentLocation) {
            refNode.classList.add('active-tab');
          }
        });
        customSidebar.appendChild(content);

        const hr = document.createElement('hr');
        hr.classList.add('sidebar-custom-hr');
        customSidebar.appendChild(hr);
      }
    });

  const search = document.createElement('input');
  search.type = 'search';
  search.autoComplete = 'off';
  search.placeholder = 'Search...';
  search.addEventListener('input', function (e) {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      resetSearch();
      return;
    }

    document.querySelectorAll('.custom-card-identifier').forEach((text) => {
      if (text.textContent.toLowerCase().includes(query)) {
        text.closest('a').style.display = 'block';
      } else {
        text.closest('a').style.display = 'none';
      }
    });
  });

  function resetSearch() {
    document.querySelectorAll('.custom-card-identifier').forEach((text) => {
      text.closest('a').style.display = '';
    });
  }

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-container');

  const pinButton = document.createElement('div');
  pinButton.classList.add('pin-button');

  const pinIcon = document.createElement('img');
  pinIcon.classList.add('pin-icon');
  pinIcon.src = pinDataUri;

  pinButton.appendChild(pinIcon);

  const isPinned =
    JSON.parse(localStorage.getItem('isCustomSidebarPinned')) || false;
  pinIcon.src = isPinned ? pinDataUri : unpinnedDataUri;
  customSidebar.classList.toggle('pinned', isPinned);

  pinButton.addEventListener('click', function () {
    const isPinned = pinButton
      .closest('.custom-sidebar')
      .classList.toggle('pinned');
    pinButton.querySelector('img').src = isPinned
      ? pinDataUri
      : unpinnedDataUri;
    localStorage.setItem('isCustomSidebarPinned', JSON.stringify(isPinned));
  });

  searchContainer.appendChild(pinButton);
  searchContainer.appendChild(search);
  customSidebar.insertBefore(searchContainer, customSidebar.firstChild);

  document.body.appendChild(customSidebar);
  document.head.appendChild(style);
  document.addEventListener('click', function (e) {
    if (!e.target.closest('input')) {
      search.blur();
    }
  });
})();
