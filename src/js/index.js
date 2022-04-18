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
const modalCreate = document.getElementById('modal-1');
const modalSelect = document.getElementById('modalSelect');
const selectInput = document.getElementById('selectInput');

const getData = async () => {
  const response = await fetch('http://localhost:3000/api/clients');
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
    const clientContacts = el('div.table__client-cell');
    contacts.forEach(contact => {
      const newContact = el('div', contact.value);
      setChildren(clientContacts, newContact);
    })
    const clientEditBtn = el('button.table__btn.edit-btn', 'Изменить');
    const clientRemoveBtn = el('button.table__btn.remove-btn', 'Удалить');

    clientRemoveBtn.addEventListener('click', () => {
      deleteClient({ element: clientRow, client: client })
    })
    clientEditBtn.addEventListener('click', () => {
      openEditModal(client);
    })

    setChildren(tableData, clientRow);
    setChildren(clientRow, [clientId, clientFio, clientCreatedAt, clientUpdatedAt, clientContacts, clientEditBtn, clientRemoveBtn])
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
  modalCreate.classList.toggle('is-open');
  modalCreate.setAttribute('aria-hidden', 'true');
  renderClients();
};

saveBtn.addEventListener('click', createClient);
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

const openEditModal = async (client) => {
  MicroModal.show('modal-1');
  nameInput.value = client.name;
  surnameInput.value = client.surname;
  lastNameInput.value = client.lastName;
};
