document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  // Generate initial user list and register handlers
  generateUserList(userData, stocksData);

  // Button elements
  const saveButton = document.querySelector('#saveButton');
  const deleteButton = document.querySelector('#deleteButton');

  // Save user details
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    const id = document.querySelector('#userID').value;
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;
        // Repopulate form with updated user info to confirm save
        populateForm(userData[i]);
        break;
      }
    }
    // Regenerate the user list to reflect changes
    generateUserList(userData, stocksData);
  });

  // Delete user
  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    const userId = document.querySelector('#userID').value;
    const index = userData.findIndex(user => user.id == userId);
    if (index > -1) {
      userData.splice(index, 1);
      clearForm();
      clearPortfolio();
      clearStockInfo();
      generateUserList(userData, stocksData);
    }
  });

  // Clear form helper
  function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
  }
  // Clear portfolio helper
  function clearPortfolio() {
    document.querySelector('.portfolio-list').innerHTML = '';
  }
  // Clear stock info helper
  function clearStockInfo() {
    document.querySelector('#stockName').textContent = '';
    document.querySelector('#stockSector').textContent = '';
    document.querySelector('#stockIndustry').textContent = '';
    document.querySelector('#stockAddress').textContent = '';
    document.querySelector('#logo').src = '';
  }
});

// Generate user list and register click event on list
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = ''; // Clear old

  users.forEach(({ user, id }) => {
    const li = document.createElement('li');
    li.textContent = `${user.lastname}, ${user.firstname}`;
    li.setAttribute('id', id);
    userList.appendChild(li);
  });

  userList.onclick = (e) => {
    if (e.target.tagName === 'LI') {
      handleUserListClick(e.target.id, users, stocks);
    }
  };
}

// Handle user list item click: populate form, render portfolio
function handleUserListClick(userId, users, stocks) {
  const user = users.find(u => u.id == userId);
  if (!user) return;
  populateForm(user);
  renderPortfolio(user, stocks);
  clearStockInfo();
}

// Populate form fields with user data
function populateForm(data) {
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

// Render portfolio items for a selected user
function renderPortfolio(user, stocks) {
  const portfolioDetails = document.querySelector('.portfolio-list');
  portfolioDetails.innerHTML = ''; // clear existing

  user.portfolio.forEach(({ symbol, owned }) => {
    const container = document.createElement('div');
    container.className = 'portfolio-item';

    const symEl = document.createElement('p');
    symEl.textContent = symbol;

    const ownedEl = document.createElement('p');
    ownedEl.textContent = owned;

    const btn = document.createElement('button');
    btn.textContent = 'View';
    btn.id = symbol;

    btn.onclick = () => {
      viewStock(symbol, stocks);
    };

    container.appendChild(symEl);
    container.appendChild(ownedEl);
    container.appendChild(btn);
    portfolioDetails.appendChild(container);
  });
}

// Display selected stock details
function viewStock(symbol, stocks) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) return;
  document.querySelector('#stockName').textContent = stock.name;
  document.querySelector('#stockSector').textContent = stock.sector;
  document.querySelector('#stockIndustry').textContent = stock.subIndustry;
  document.querySelector('#stockAddress').textContent = stock.address;
  document.querySelector('#logo').src = `logos/${symbol}.svg`;
}


