// phonebook_final.js
// גרסה מלאה ומשופרת של ספר טלפונים – כולל סינון מועדפים, תצוגת פרטי איש קשר ופופאפ מותאם
'use strict';

const contacts = [
  { name: 'Alice Johnson', phone: '054-1234567', email: 'alice@mail.com', address: 'Herzliya', notes: 'Friend from school', favorite: false },
  { name: 'Ben Levi', phone: '052-9876543', email: 'benl@example.com', address: 'Tel Aviv', notes: 'Work contact', favorite: false },
  { name: 'Dana Goldstein', phone: '050-1122334', email: 'dana.g@example.com', address: 'Ramat Gan', notes: 'Met at conference', favorite: false },
  { name: 'Eran Katz', phone: '052-2233445', email: 'eran.k@example.com', address: 'Jerusalem', notes: 'Project partner', favorite: false },
  { name: 'Fiona Saar', phone: '053-3344556', email: 'fiona@example.com', address: 'Kiryat Ono', notes: 'Neighbor', favorite: false },
  { name: 'Gilad Barkai', phone: '054-4455667', email: 'gilad@company.com', address: 'Beer Sheva', notes: 'Client', favorite: false },
  { name: 'Hadas Azulay', phone: '055-5566778', email: 'hadas@gmail.com', address: 'Netanya', notes: 'Friend from army', favorite: false },
  { name: 'Idan Mor', phone: '056-6677889', email: 'idan.m@example.com', address: 'Modiin', notes: 'Basketball team', favorite: false },
  { name: 'Jackie Peretz', phone: '057-7788990', email: 'jackiep@domain.net', address: 'Ashdod', notes: 'Met abroad', favorite: false },
  { name: 'Kelly Shani', phone: '058-8899001', email: 'kelly@site.com', address: 'Petah Tikva', notes: 'Yoga class', favorite: false },
  { name: 'Lior Avrahami', phone: '053-7654321', email: 'lior@example.com', address: 'Holon', notes: 'Colleague', favorite: false },
  { name: 'Maya Tal', phone: '054-9911223', email: 'maya.tal@mail.com', address: 'Rehovot', notes: 'Art club', favorite: false },
  { name: 'Nadav Ramon', phone: '050-1011121', email: 'nadav@domain.org', address: 'Bat Yam', notes: 'Old friend', favorite: false },
  { name: 'Ophir Ben-David', phone: '052-1314151', email: 'ophirbd@example.com', address: 'Eilat', notes: 'Beach trip buddy', favorite: false },
  { name: 'Pnina Shalom', phone: '053-1415161', email: 'pnina@mail.net', address: 'Zichron Yaakov', notes: 'Choir member', favorite: false },
  { name: 'Roi Segal', phone: '054-1617181', email: 'roi@myemail.com', address: 'Raanana', notes: 'Tennis partner', favorite: false },
  { name: 'Shira Klein', phone: '055-1819202', email: 'shira.klein@example.com', address: 'Givatayim', notes: 'Friend from uni', favorite: false },
  { name: 'Tom Bar', phone: '056-2021222', email: 'tom.b@example.com', address: 'Yokneam', notes: 'Photography class', favorite: false },
  { name: 'Yael Harari', phone: '057-2122233', email: 'yaelh@example.org', address: 'Kfar Saba', notes: 'Business partner', favorite: false }
];

let currentEditIndex = -1;
let showOnlyFavorites = false;
let pendingDeleteIndex = null;

function renderContacts(filteredContacts = contacts) {
  const contactList = document.getElementById('contactList');
  contactList.innerHTML = '';

  filteredContacts.forEach((contact, index) => {
    const li = document.createElement('li');
    li.className = 'contact-item';

    const details = document.createElement('div');
    details.className = 'contact-details';
    details.innerHTML = `<strong>${contact.name}</strong><br>${contact.phone}<br>${contact.email || ''}<br>${contact.address || ''}<br>${contact.notes || ''}`;

    const actions = document.createElement('div');
    actions.className = 'contact-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editContact(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteContact(index);

    const favBtn = document.createElement('button');
    favBtn.innerHTML = contact.favorite ? '★' : '☆';
    favBtn.className = 'favorite';
    favBtn.onclick = () => toggleFavorite(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    actions.appendChild(favBtn);

    li.appendChild(details);
    li.appendChild(actions);
    contactList.appendChild(li);
  });
}

function editContact(index) {
  currentEditIndex = index;
  const contact = contacts[index];
  document.getElementById('editName').value = contact.name;
  document.getElementById('editPhone').value = contact.phone;
  document.getElementById('editEmail').value = contact.email;
  document.getElementById('editAddress').value = contact.address;
  document.getElementById('editNotes').value = contact.notes;
  document.getElementById('editError').textContent = '';
  document.getElementById('editPopup').style.display = 'flex';
}

function deleteContact(index) {
  contacts.splice(index, 1);
  renderContacts();
}

function toggleFavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  renderContacts();
}

function filterContacts(query) {
  const lowerQuery = query.toLowerCase();
  return contacts.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.phone.includes(query) ||
    (c.email && c.email.toLowerCase().includes(lowerQuery)) ||
    (c.address && c.address.toLowerCase().includes(lowerQuery)) ||
    (c.notes && c.notes.toLowerCase().includes(lowerQuery))
  );
}

document.addEventListener('DOMContentLoaded', () => {
  renderContacts();

  document.getElementById('openPhonebookBtn').addEventListener('click', () => {
    document.getElementById('phonebookClosed').style.display = 'none';
    document.getElementById('phonebookList').style.display = 'block';
  });

  document.getElementById('closePhonebookBtn').addEventListener('click', () => {
    document.getElementById('phonebookClosed').style.display = 'block';
    document.getElementById('phonebookList').style.display = 'none';
  });

  document.getElementById('addContactBtn').addEventListener('click', () => {
    document.getElementById('contactForm').reset();
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('error').textContent = '';
    currentEditIndex = -1;
  });

  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });

  document.getElementById('closeEditPopup').addEventListener('click', () => {
    document.getElementById('editPopup').style.display = 'none';
  });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const errorElem = document.getElementById('error');
    errorElem.textContent = '';

    if (contacts.some((c, i) => i !== currentEditIndex && c.name.toLowerCase() === name.toLowerCase())) {
      errorElem.textContent = 'Name already exists.';
      return;
    }

    if (contacts.some((c, i) => i !== currentEditIndex && c.phone === phone)) {
      errorElem.textContent = 'Phone number already exists.';
      return;
    }

    if (currentEditIndex !== -1) {
      contacts[currentEditIndex] = { name, phone, email, address, notes, favorite: contacts[currentEditIndex].favorite };
      currentEditIndex = -1;
      document.getElementById("successMessageText").textContent = "✔️ Contact updated successfully!";
    } else {
      contacts.push({ name, phone, email, address, notes, favorite: false });
      document.getElementById("successMessageText").textContent = "✔️ Contact added successfully!";
    }

    document.getElementById('popup').style.display = 'none';
    document.getElementById("successPopup").style.display = "flex";
    renderContacts();
  });

  document.getElementById('editContactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const notes = document.getElementById('editNotes').value.trim();
    const errorElem = document.getElementById('editError');
    errorElem.textContent = '';

    if (contacts.some((c, i) => i !== currentEditIndex && c.name === name)) {
      errorElem.textContent = 'Name already exists for another contact';
      return;
    }

    if (contacts.some((c, i) => i !== currentEditIndex && c.phone === phone)) {
      errorElem.textContent = 'Phone number already exists for another contact';
      return;
    }

    contacts[currentEditIndex] = {
      ...contacts[currentEditIndex],
      name,
      phone,
      email,
      address,
      notes
    };

    document.getElementById('editPopup').style.display = 'none';
    currentEditIndex = -1;
    renderContacts();
  });

  document.getElementById("successCloseBtn").addEventListener("click", () => {
    document.getElementById("successPopup").style.display = "none";
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.trim();
    renderContacts(filterContacts(query));
  });
});