// phonebook_final.js
'use strict';

const contacts = [
  { name: 'Alice Johnson', phone: '054-1234567', email: 'alice@mail.com', address: 'Herzliya', notes: 'Friend from school', favorite: false },
  { name: 'Ben Levi', phone: '052-9876543', email: 'benl@example.com', address: 'Tel Aviv', notes: 'Work contact', favorite: false },
  // הוסף אנשי קשר נוספים לפי הצורך
];

let currentEditIndex = -1;
let showOnlyFavorites = false;
let pendingDeleteIndex = null;

function renderContacts(filterText = '') {
  const list = document.getElementById('contact-list');
  list.innerHTML = '';
  const filtered = contacts
    .filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
    .filter(c => !showOnlyFavorites || c.favorite)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!filtered.length) {
    list.innerHTML = '<li>No contacts found.</li>';
    return;
  }

  filtered.forEach(contact => {
    const idx = contacts.indexOf(contact);
    const li = document.createElement('li');
    li.dataset.index = idx;

    const star = document.createElement('span');
    star.textContent = contact.favorite ? '⭐' : '☆';
    star.className = 'star-icon';
    star.title = 'Toggle favorite';
    star.addEventListener('click', e => {
      e.stopPropagation();
      contact.favorite = !contact.favorite;
      renderContacts(filterText);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'small-btn';
    editBtn.title = 'Edit contact';
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      openEditForm(idx);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.className = 'small-btn';
    delBtn.title = 'Delete contact';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      pendingDeleteIndex = idx;
      document.getElementById('deleteConfirmText').textContent = `Delete ${contact.name}?`;
      document.getElementById('deleteConfirmPopup').style.display = 'flex';
    });

    li.append(star, ` ${contact.name} - ${contact.phone} `, editBtn, delBtn);

    li.addEventListener('click', () => {
      const infoText = document.getElementById("contactInfoText");
      const infoPopup = document.getElementById("contactInfoPopup");
      infoText.innerHTML = `
        <span style="font-size: 1.6rem; font-weight: bold;
        background: linear-gradient(90deg, rgb(113, 196, 255), rgb(255, 255, 255));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
          ${contact.name}
        </span><br>
        <span style="color: white;">
          📞 Phone Number: ${contact.phone}<br>
          ✉️ E-Mail: ${contact.email || 'N/A'}<br>
          📍 Location: ${contact.address || 'N/A'}<br>
          📝 Notes: ${contact.notes || 'N/A'}
        </span>
      `;
      infoPopup.style.display = "flex";
    });

    list.appendChild(li);
  });
}

function openEditForm(index) {
  currentEditIndex = index;
  const c = contacts[index];
  document.getElementById('editName').value = c.name;
  document.getElementById('editPhone').value = c.phone;
  document.getElementById('editEmail').value = c.email || '';
  document.getElementById('editAddress').value = c.address || '';
  document.getElementById('editNotes').value = c.notes || '';
  document.getElementById('editPopup').style.display = 'flex';
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
  });

  document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!name || !phone) {
      document.getElementById('error').textContent = 'Name and phone are required.';
      return;
    }

    const exists = contacts.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      document.getElementById('error').textContent = 'Name already exists.';
      return;
    }

    contacts.push({ name, phone, email, address, notes, favorite: false });
    document.getElementById('popup').style.display = 'none';
    document.getElementById("successMessageText").textContent = "✅ Contact added successfully!";
    document.getElementById("successPopup").style.display = "flex";
    renderContacts(document.getElementById('searchInput').value);
  });

  document.getElementById('editContactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('editName').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const notes = document.getElementById('editNotes').value.trim();

    if (!name || !phone) return;

    const nameExists = contacts.some((c, i) => i !== currentEditIndex && c.name.toLowerCase() === name.toLowerCase());
    if (nameExists) {
      alert('Name already exists.');
      return;
    }

    contacts[currentEditIndex] = { ...contacts[currentEditIndex], name, phone, email, address, notes };
    document.getElementById('editPopup').style.display = 'none';
    renderContacts(document.getElementById('searchInput').value);
  });

  document.getElementById('closeEditPopup').addEventListener('click', () => {
    document.getElementById('editPopup').style.display = 'none';
    currentEditIndex = -1;
  });

  document.getElementById('deleteAllBtn').addEventListener('click', () => {
    if (contacts.length === 0) return;
    document.getElementById('confirmMessage').textContent = 'Delete ALL contacts?';
    document.getElementById('confirmPopup').style.display = 'flex';

    document.getElementById('confirmYes').onclick = () => {
      contacts.length = 0;
      renderContacts();
      document.getElementById('confirmPopup').style.display = 'none';
    };

    document.getElementById('confirmNo').onclick = () => {
      document.getElementById('confirmPopup').style.display = 'none';
    };
  });

  document.getElementById('confirmDeleteYes').addEventListener('click', () => {
    if (pendingDeleteIndex !== null) {
      contacts.splice(pendingDeleteIndex, 1);
      renderContacts(document.getElementById('searchInput').value);
      pendingDeleteIndex = null;
      document.getElementById('deleteConfirmPopup').style.display = 'none';
    }
  });

  document.getElementById('confirmDeleteNo').addEventListener('click', () => {
    pendingDeleteIndex = null;
    document.getElementById('deleteConfirmPopup').style.display = 'none';
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    renderContacts(e.target.value);
  });

  document.getElementById('toggleFavoritesBtn')?.addEventListener('click', () => {
    showOnlyFavorites = !showOnlyFavorites;
    document.getElementById('toggleFavoritesBtn').textContent = showOnlyFavorites ? 'Show All Contacts' : 'Show Only Favorites';
    renderContacts(document.getElementById('searchInput').value);
  });

  document.getElementById('closeContactInfoPopup').addEventListener('click', () => {
    document.getElementById('contactInfoPopup').style.display = 'none';
  });

  document.getElementById('successPopup').addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.getElementById('contactInfoPopup').style.display = 'none';
      document.getElementById('successPopup').style.display = 'none';
    }
  });

  document.getElementById('closeSuccessPopup').addEventListener('click', () => {
    document.getElementById('successPopup').style.display = 'none';
  });

  document.getElementById('contactInfoPopup').addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
  });
});