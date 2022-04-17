import '../css/normalize.css';
import '../css/modal.css';
import '../css/style.css';
import { el, setChildren} from 'redom';
import MicroModal from 'micromodal';
MicroModal.init();

const tableData = document.querySelector('.table__data');
const saveBtn = document.getElementById('savebtn');
const nameInput = document.getElementById('name');
const surnameInput = document.getElementById('surname');
const lastNameInput = document.getElementById('lastName');
const modalSelect = document.getElementById('modalSelect');
const selectInput = document.getElementById('selectInput');

const getData = async () => {
  const response = await fetch('http://localhost:3000/api/clients');
  const result = await response.json();
  return result;
};

const renderClients = async () => {
  const clients = await getData();
  clients.forEach(client => {
    const clientRow = el('div.table-grid');
    const clientId = el('div', client.id);
    const clientFio = el('div', client.surname + ' ' + client.name + ' ' + client.lastName);
    const clientCreatedAt = el('div', client.createdAt);
    const clientUpdatedAt = el('div', client.updatedAt);
    const contacts = client.contacts;
    const clientContacts = el('div');
    contacts.forEach(contact => {
      const newContact = el('div', contact.value);
      setChildren(clientContacts, newContact);
    })
    const clientChangeBtn = el('button', 'Изменить');
    const clientRemoveBtn = el('button', 'Удалить');
    setChildren(tableData, clientRow);
    setChildren(clientRow, [clientId, clientFio, clientCreatedAt, clientUpdatedAt, clientContacts, clientChangeBtn, clientRemoveBtn])
  });
};

renderClients();


const createClient = () => {
  fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput.value.trim(),
      surname: surnameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      contacts: [
        {
          type: modalSelect.value,
          value: selectInput.value,
        }
      ]
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  nameInput.value = '';
  surnameInput.value = '';
  lastNameInput.value = '';
  const modalCreate = document.getElementById('modal-1');
  modalCreate.classList.toggle('is-open');
  modalCreate.setAttribute('aria-hidden', 'true');
  renderClients();
};

saveBtn.addEventListener('click', createClient);
console.log(getData());
