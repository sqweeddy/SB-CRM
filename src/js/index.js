import '../css/normalize.css';
import '../css/modal.css';
import '../css/choices.min.css'
import client from '../img/client.svg';
import canelIcon from '../img/cancel.svg';
import editIcon from '../img/edit.svg';
import vkIcon from '../img/VK.svg';
import fbIcon from '../img/Facebook.svg';
import telIcon from '../img/tel.svg';
import addtelIcon from '../img/addtel.svg';
import EmailIcon from '../img/Email.svg';
import arrowIcon from '../img/arrow.svg';
import plus from '../img/plus.svg';
import { el, setChildren, mount} from 'redom';
import MicroModal from 'micromodal';
import Choices from 'choices.js';
import tippy from 'tippy.js';
import Inputmask from "inputmask";
import 'tippy.js/dist/tippy.css';
import '../css/style.css';



const apiUrl = 'http://localhost:3000/api/clients/';
const search = document.getElementById('search');
const id = document.getElementById('id');
const fio = document.getElementById('fio');
const createdAt = document.getElementById('create-date');
const updatedAt = document.getElementById('change-date');
const tableData = document.querySelector('.table__data');
const saveBtn = document.getElementById('modal-1-content');
const removeConfirm = document.getElementById('confirmbrn');
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const lastNameInput = document.getElementById('lastName');
const modalTitle = document.getElementById('modal-1-title');
const modalContacts = document.getElementById('modalContacts');
const clientId = document.querySelector('.modal__client-id');
const modalBtnAddContact = document.getElementById('modalBtnAddContact');

const getData = async () => {
  const response = await fetch(apiUrl);
  const result = await response.json();
  return result;
};

const dataHandler = (date) => {
  let dateH = new Date(date);
  let dd = dateH.getDate();
  let mm = dateH.getMonth() + 1;
  let yyyy = dateH.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  };
  if (mm < 10) {
    mm = '0' + mm;
  };
  const handledDate = dd + '.' + mm + '.' + yyyy;
  return handledDate;
}

const timeHandler = (date) => {
  let timeH = new Date(date);
  let hh = timeH.getHours();
  let mm = timeH.getMinutes();
  if (hh < 10) {
    hh = '0' + hh;
  };
  if (mm < 10) {
    mm = '0' + mm;
  };
  const handledTime = hh + ':' + mm;
  return handledTime;
}

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// const createContactIcon = (contacts) => {
//   contacts.forEach(contact => {
//     const btn = el('button.table__tooltip');
//     btn.innerHTML = `<svg class="table__contact-icon"><use xlink:href="#${contact.type}"></use></svg>`;
//     let tooltip;
//     if (contact.type == 'tel' || contact.type == 'addtel') {
//         tooltip = `<a class="table__tel-link" href="tel:${contact.value}">${contact.value}</a>`;
//     } else {
//       tooltip = `${contact.type}: <a class="table__contact-link" href="${contact.value}">${contact.value}</a>`;
//     }
//     tippy(btn, {
//       content: tooltip,
//       theme: 'crm',
//       allowHTML: true,
//       interactive: true,
//     })
//     mount(clientContacts, btn);
//   })
// }

const renderClients = async (clients=[]) => {
  const loader = el('div.loader');
  mount(tableData, loader);
  clients = clients.length === 0 ? await getData() : clients;
  tableData.innerHTML = '';
  clients.forEach(client => {
    const clientRow = el('div.table__grid.table-row');
    const clientId = el('div.table__client-cell.table__id', client.id);
    const clientFio = el('div.table__client-cell', client.surname + ' ' + client.name + ' ' + client.lastName);
    const clientCreatedAt = el('div.table__client-cell', el('div.table__date', dataHandler(client.createdAt)), el('div.table__time', timeHandler(client.createdAt)));
    const clientUpdatedAt = el('div.table__client-cell', el('div.table__date', dataHandler(client.updatedAt)), el('div.table__time', timeHandler(client.updatedAt)));
    const contacts = client.contacts;
    const clientContacts = el('div.table__client-cell.contacts-grid');

    for (let contactType = 0; contactType < contacts.length; contactType++) {
      const contact = contacts[contactType];
      const createIcon = (icon = contact) => {
        const btn = el('button.table__tooltip');
        btn.innerHTML = `<svg class="table__contact-icon"><use xlink:href="#${icon.type}"></use></svg>`;
        let tooltip;
        if (icon.type == 'tel' || icon.type == 'addtel') {
            tooltip = `<a class="table__tel-link" href="tel:${icon.value}">${icon.value}</a>`;
        } else if (icon.type == 'Email') {
          tooltip = `<a class="table__contact-link" href="mailto:${icon.value}">${icon.value}</a>`;
        } else {
          tooltip = `${icon.type}: <a class="table__contact-link" href="https://${icon.value}">${icon.value}</a>`;
        }
        tippy(btn, {
          content: tooltip,
          theme: 'crm',
          allowHTML: true,
          interactive: true,
          hideOnClick: true,
          trigger: 'mouseenter',
        })
        mount(clientContacts, btn);
      }
      if (contacts.length < 6) {
        createIcon();
      } else if (contacts.length > 5) {
          createIcon();
          if (contactType == 3) {
            const restContactsBtn = el('button.table__rest-contacts');
            restContactsBtn.innerText = contacts.length - contactType - 1;
            mount(clientContacts, restContactsBtn);
            restContactsBtn.addEventListener('click', () => {
              while (clientContacts.firstChild) {
                clientContacts.firstChild.remove();
              }
              contacts.forEach(contact => {
                createIcon(contact);
              })
            })
            break
          }
        }
      }

    const clientEditBtn = el('button.table__btn.edit-btn');
    clientEditBtn.innerHTML = `<svg class="table__action-icon icon-edit"><use xlink:href="#edit"></use></svg>Изменить`;
    const clientRemoveBtn = el('button.table__btn.remove-btn');
    clientRemoveBtn.setAttribute('data-micromodal-trigger', "modal-2");
    clientRemoveBtn.innerHTML = `<svg class="table__action-icon icon-remove"><use xlink:href="#cancel"></use></svg>Удалить`;

    clientRemoveBtn.addEventListener('click', (e) => {
      // e.preventDefault();
      // deleteClient({ element: clientRow, client: client });
      removeConfirm.addEventListener('click', () => {
        deleteClient({ element: clientRow, client: client });
      })
    })
    clientEditBtn.addEventListener('click', () => {
      openEditModal(client);
    })
    clientEditBtn.setAttribute('data-micromodal-trigger', 'modal-1');


    mount(tableData, clientRow);
    setChildren(clientRow, [clientId, clientFio, clientCreatedAt, clientUpdatedAt, clientContacts, clientEditBtn, clientRemoveBtn])
  });
  MicroModal.init({
    onShow: modal => console.info(`${modal.id} is shown`),
    onClose: modal => {clearModal(); console.info(`${modal.id} is hide`)},
    awaitCloseAnimation: true,
  });
};

const createContactAdd = (selectValue=null, inputValue=null) => {
  const iV = inputValue == null ? '' : inputValue;
  const sV = selectValue == null ? 'tel' : selectValue;
  const contactWrapper = el('div.modal__contact-wrapper')
  const newSelect = el('select.modal__select',
    el('option', { value: 'tel' }, 'Телефон'),
    el('option', { value: 'addtel' }, 'Доп. телефон'),
    el('option', { value: 'Email' }, 'Email'),
    el('option', { value: 'VK' }, 'VK'),
    el('option', { value: 'Facebook' }, 'Facebook'));

  const newInput = el('input.modal__contact-input', {  placeholder: 'Введите данные контакта' });
  newInput.value = iV;
  newSelect.value = sV;
  const setInputMask = () => {
    Inputmask.remove(newInput);
    switch (newSelect.value) {
      case 'tel':
        console.log('tel');
        Inputmask({"mask": "+ 7 (999) 999-99-99",}).mask(newInput);
        break;

      case 'addtel':
        console.log('tel');
        Inputmask({"mask": "+ 7 (999) 999-99-99",}).mask(newInput);
        break;

      case 'Email':
        Inputmask('email').mask(newInput);
        break;

      case 'VK':
        console.log('vk');
        Inputmask(['vk.com/*{1,10}']).mask(newInput);
        break;

      case 'Facebook':
        console.log('fb');
        Inputmask({"mask": "fb.com/*{1,10}",}).mask(newInput);
        break;

      default:
        break;
    };
  };
  setInputMask()

  newSelect.addEventListener('change', () => {
    setInputMask()
  })

  const removeContact = el('button.modal__contact-remove');
  removeContact.innerHTML = `<svg class="modal__contact-remove-icon"><use xlink:href="#cancel"></use></svg>`;
  removeContact.addEventListener('click', () => {
    contactWrapper.remove();
  })

  setChildren(contactWrapper, [newSelect, newInput, removeContact]);

  mount(modalContacts, contactWrapper);
  const choices = new Choices(newSelect, {
    shouldSort: false,
    searchEnabled: false,
    removeItemButton: false,
    itemSelectText: '',
    allowHTML: true
  });
};

modalBtnAddContact.addEventListener('click', (e) => {
  e.preventDefault();
  if (document.querySelectorAll('.modal__contact-wrapper').length < 10) {
    createContactAdd();
  }
});

const parseContacts = () => {
  const contacts = [];
  const select = document.querySelectorAll('.modal__select');
  const input = document.querySelectorAll('.modal__contact-input');
  for (let i = 0; i < select.length; i++) {
    if (input[i].value) {
      const newContact = {};
      newContact.type = select[i].value;
      newContact.value = input[i].value;
      contacts.push(newContact);

      select[i].value = '';
      input[i].value = '';
    }
  };
  document.querySelectorAll('.modal__contact-wrapper').forEach(el => el.remove());
  return contacts;
}

const createClient = async (id = null) => {
  try {
    const method = id == null ? 'POST' : 'PATCH';
    const clientId = id == null ? '' : id;
    const response = await fetch(new URL(clientId, apiUrl), {
      method: method,
      body: JSON.stringify({
        name: nameInput.value.trim(),
        surname: surnameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        contacts: parseContacts(),
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    alert(error.message);
  }
  MicroModal.close('modal-1');
  renderClients();
};

saveBtn.addEventListener('submit', async () => {
  if (clientId.textContent != '') {
    createClient(clientId.textContent)
  } else createClient();
});
console.log(getData());

const deleteClient = async ({element, client}) => {
  try {
    const response = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
    method: 'DELETE'
  });
  if (response.status == '404'|| response.status == '422') {
    throw new Error ('Что-то пошло не так...');
  }
  } catch (error) {
    alert(error.message);
  }
  element.remove();
  MicroModal.close('modal-2');
  renderClients();
}

const clearModal = () => {
  document.querySelectorAll('.modal__contact-wrapper').forEach(el => el.remove());
  document.querySelectorAll('.modal__input').forEach(el => el.value = '');
  clientId.textContent = '';
  modalTitle.textContent = 'Новый клиент';
}

const openEditModal = async (client) => {
  modalTitle.textContent = 'Изменить данные';
  nameInput.value = client.name;
  surnameInput.value = client.surname;
  lastNameInput.value = client.lastName;
  clientId.textContent = client.id;
  client.contacts.forEach(contact => {
    createContactAdd(contact.type, contact.value);
  });
};


/* FILTER */

id.addEventListener('click', async () => {
  fio.classList.remove('table__title--active');
  fio.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  createdAt.classList.remove('table__title--active');
  createdAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  updatedAt.classList.remove('table__title--active');
  updatedAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  let sorted = [];
  const clients = await getData();
  sorted = clients;
  const icon = id.querySelector('.table__sort-icon');
  const sorting = (direction) => {
    if (direction == 'down') {
      sorted.sort(function(a, b) {
        if(a.id < b.id ) return -1;
        if(a.id > b.id ) return 1;
        return 0;
      });
    } else {
      sorted.sort(function(a, b) {
        if(a.id < b.id ) return 1;
        if(a.id > b.id ) return -1;
        return 0;
      });
    };
  };
  if (id.classList.contains('table__title--active') && id.querySelector('.table__sort-icon--active')) {
    sorting('up');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else if (id.classList.contains('table__title--active')) {
    sorting('down');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else {
    sorting('down');
    id.classList.toggle('table__title--active');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  }
})

fio.addEventListener('click', async () => {
  id.classList.remove('table__title--active');
  id.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  createdAt.classList.remove('table__title--active');
  createdAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  updatedAt.classList.remove('table__title--active');
  updatedAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  let sorted = [];
  const clients = await getData();
  sorted = clients;
  const icon = fio.querySelector('.table__sort-icon');
  const sorting = (direction) => {
    if (direction == 'down') {
      sorted.sort(function(a, b) {
        if(a.surname < b.surname ) return -1;
        if(a.surname > b.surname ) return 1;
        if (a.lastName > b.lastName) return -1;
        if (a.lastName < b.lastName) return 1;
        if(a.name < b.name ) return 1;
        if(a.name > b.name ) return -1;
        return 0;
      });
    } else {
      sorted.sort(function(a, b) {
        if(a.surname < b.surname ) return 1;
        if(a.surname > b.surname ) return -1;
        if (a.lastName > b.lastName) return 1;
        if (a.lastName < b.lastName) return -1;
        if(a.name < b.name ) return -1;
        if(a.name > b.name ) return 1;
        return 0;
      });
    };
  };
  if (fio.classList.contains('table__title--active') && fio.querySelector('.table__sort-icon--active')) {
    sorting('up');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else if (fio.classList.contains('table__title--active')) {
    sorting('down');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else {
    sorting('down');
    fio.classList.toggle('table__title--active');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  };
});

createdAt.addEventListener('click', async () => {
  id.classList.remove('table__title--active');
  id.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  fio.classList.remove('table__title--active');
  fio.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  updatedAt.classList.remove('table__title--active');
  updatedAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  let sorted = [];
  const clients = await getData();
  sorted = clients;
  const icon = createdAt.querySelector('.table__sort-icon');
  const sorting = (direction) => {
    if (direction == 'down') {
      sorted.sort(function(a, b) {
        if(a.createdAt < b.createdAt) return -1;
        if(a.createdAt > b.createdAt) return 1;
        return 0;
      });
    } else {
      sorted.sort(function(a, b) {
        if(a.createdAt < b.createdAt) return 1;
        if(a.createdAt > b.createdAt) return -1;
        return 0;
      });
    };
  };
  if (createdAt.classList.contains('table__title--active') && createdAt.querySelector('.table__sort-icon--active')) {
    sorting('up');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else if (createdAt.classList.contains('table__title--active')) {
    sorting('down');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else {
    sorting('down');
    createdAt.classList.toggle('table__title--active');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  };
});

updatedAt.addEventListener('click', async () => {
  id.classList.remove('table__title--active');
  id.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  createdAt.classList.remove('table__title--active');
  createdAt.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  fio.classList.remove('table__title--active');
  fio.querySelector('.table__sort-icon').classList.remove('table__sort-icon--active');
  let sorted = [];
  const clients = await getData();
  sorted = clients;
  const icon = updatedAt.querySelector('.table__sort-icon');
  const sorting = (direction) => {
    if (direction == 'down') {
      sorted.sort(function(a, b) {
        if(a.updatedAt < b.updatedAt) return -1;
        if(a.updatedAt > b.updatedAt) return 1;
        return 0;
      });
    } else {
      sorted.sort(function(a, b) {
        if(a.updatedAt < b.updatedAt) return 1;
        if(a.updatedAt > b.updatedAt) return -1;
        return 0;
      });
    };
  };
  if (updatedAt.classList.contains('table__title--active') && updatedAt.querySelector('.table__sort-icon--active')) {
    sorting('up')
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else if (updatedAt.classList.contains('table__title--active')) {
    sorting('down');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  } else {
    sorting('down');
    updatedAt.classList.toggle('table__title--active');
    icon.classList.toggle('table__sort-icon--active');
    renderClients(sorted)
  };
});

/* Search */

const searching = async () => {
  const response = await fetch(`http://localhost:3000/api/clients?search=${search.value}`, {
    method: 'GET'
  });
  const result = await response.json();
  renderClients(result);
};

search.addEventListener('input', async () => {
  setTimeout(searching, 300)
});

renderClients();
