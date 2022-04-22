import '../css/normalize.css';
import '../css/modal.css';
import '../css/choices.min.css'
import canelIcon from '../img/cancel.svg';
import editIcon from '../img/edit.svg';
import vkIcon from '../img/VK.svg';
import fbIcon from '../img/Facebook.svg';
import telIcon from '../img/tel.svg';
import addtelIcon from '../img/addtel.svg';
import EmailIcon from '../img/Email.svg';
import { el, setChildren, mount} from 'redom';
import MicroModal from 'micromodal';
import Choices from 'choices.js';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import '../css/style.css';



const apiUrl = 'http://localhost:3000/api/clients/'
const tableData = document.querySelector('.table__data');
const saveBtn = document.getElementById('savebtn');
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

const renderClients = async () => {
  tableData.innerHTML = '';
  const clients = await getData();
  clients.forEach(client => {
    const clientRow = el('div.table__grid.table-row');
    const clientId = el('div.table__client-cell.table__id', client.id);
    const clientFio = el('div.table__client-cell', client.surname + ' ' + client.name + ' ' + client.lastName);
    const clientCreatedAt = el('div.table__client-cell', el('div.table__date', dataHandler(client.createdAt)), el('div.table__time', timeHandler(client.createdAt)));
    const clientUpdatedAt = el('div.table__client-cell', el('div.table__date', dataHandler(client.updatedAt)), el('div.table__time', timeHandler(client.updatedAt)));
    const contacts = client.contacts;
    const clientContacts = el('div.table__client-cell.contacts-grid');
    // if (client.contacts.length < 6) {

    // } else {

    // }
    contacts.forEach(contact => {
      const id = makeid(7);
      const btn = el('button.table__tooltip');
      btn.setAttribute('id', id)
      btn.innerHTML = `<svg class="table__contact-icon"><use xlink:href="#${contact.type}"></use></svg>`;
      const text = `#${id}`;
      tippy(text, {
        content: contact.value,
      })
      mount(clientContacts, btn);


      // const newContact = el('div', contact.value);
      // setChildren(clientContacts, newContact);

      // const link = '#' + contact.type;
      // const icon = el('svg.table__contact-icon');
      // const use = el('use');
      // use.setAttribute('xlink:href', link);
      // mount(clientContacts, icon);
      // mount(icon, use);
    })
    const clientEditBtn = el('button.table__btn.edit-btn', 'Изменить');
    const clientRemoveBtn = el('button.table__btn.remove-btn', 'Удалить');

    clientRemoveBtn.addEventListener('click', () => {
      deleteClient({ element: clientRow, client: client })
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

renderClients();

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

    const newInput = el('input.modal__contact-input', { type: 'text', placeholder: 'Введите данные контакта' });
    newInput.value = iV;
    newSelect.value = sV;
    const removeContact = el('button.modal__contact-remove', 'X');
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

modalBtnAddContact.addEventListener('click', () => {
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
  const method = id == null ? 'POST' : 'PATCH';
  const clientId = id == null ? '' : id;
  fetch(new URL(clientId, apiUrl), {
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
  MicroModal.close('modal-1');
  renderClients();
};

saveBtn.addEventListener('click', () => {
  if (clientId.textContent != '') {
    createClient(clientId.textContent)
  } else createClient();
});
console.log(getData());

const deleteClient = async ({element, client}) => {
  if (!confirm('Вы уверены?')) {
    return
  };
  element.remove();
  await fetch(`http://localhost:3000/api/clients/${client.id}`, {
    method: 'DELETE'
  });
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
  // saveBtn.addEventListener('click', () => {
  //   createClient(client.id);
  // });
};

const id = makeid(7);
const btnTest = document.getElementById('asd');
btnTest.innerHTML = `<svg class="table__contact-icon"><use xlink:href="#VK"></use></svg>`
btnTest.setAttribute('id', id);
const text = `#${id}`
tippy(text, {
  content: 'text',
})
