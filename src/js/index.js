import '../css/normalize.css';
import '../css/modal.css';
import '../css/style.css';
import { el, setChildren} from 'redom';
import MicroModal from 'micromodal';
MicroModal.init();

const tableData = document.querySelector('.table__data');

const getData = async () => {
  const response = await fetch('http://localhost:3000/api/clients');
  const result = await response.json();
  return result;
}

const renderClients = async () => {
  const clients = await getData();
  clients.forEach(client => {
    const clientRow = el('div.table-grid');
    const clientId = el('div', client.id);
    const clientFio = el('div', client.surname + ' ' + client.name + ' ' + client.lastName);
    const clientCreatedAt = el('div', client.createdAt);
    const clientUpdatedAt = el('div', client.updatedAt);
    const clientContacts = el('div', client.contacts);
    const clientChangeBtn = el('button', 'Изменить');
    const clientRemoveBtn = el('button', 'Удалить');
    setChildren(tableData, clientRow);
    setChildren(clientRow, [clientId, clientFio, clientCreatedAt, clientUpdatedAt, clientContacts, clientChangeBtn, clientRemoveBtn])
  });
}

renderClients();


const createClient = (
  name,
  surname,
  lastName,
  ) => {
  fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      surname: surname,
      lastName: lastName,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

console.log(getData());

