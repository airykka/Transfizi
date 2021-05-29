'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// TRANSFIZI APP

// Data
const account1 = {
  owner: 'Adanna Erica',
  transfers: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kingsley Obinna',
  transfers: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Uzochukwu Davis Okeke',
  transfers: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Nonye Ekuma',
  transfers: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransfers = document.querySelector('.transfers');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Displaying the transfers on the dashboard.

function displayTransfers(transfers) {
  containerTransfers.innerHTML = '';

  transfers.forEach(function (transfer, index) {
    const transferType = transfer > 0 ? 'deposit' : 'withdrawal';
    const transferTemplate = `
        <div class="transfers__row">
          <div class="transfers__type transfers__type--${transferType}">${
      index + 1
    } ${transferType}</div>
          <div class="transfers__date">3 days ago</div>
          <div class="transfers__value">${transfer}€</div>
        </div>
    `;
    containerTransfers.insertAdjacentHTML('afterbegin', transferTemplate);
  });
}

//Automatically reating usernames for users

function createUsernames(accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
}

createUsernames(accounts);

//Calculating & displaying the balance of all transfers on the dashboard.

function calcDisplayBalance(account) {
  account.balance = account.transfers.reduce(
    (acc, transfer) => acc + transfer,
    0
  );
  labelBalance.textContent = `${account.balance}€`;
}

//Displaying all the summaries

function calcDisplaySummary(account) {
  const totalDeposits = account.transfers
    .filter(transfer => transfer > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  const totalWithdrawals = account.transfers
    .filter(transfer => transfer < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);

  labelSumIn.textContent = `${totalDeposits}€`;
  labelSumOut.textContent = `${Math.abs(totalWithdrawals)}€`;

  // const interest2 = totalDeposits * (1.2 / 100);

  //calculating and computing interests on deposits that are greater than 1.
  const interest = account.transfers
    .filter(transfer => transfer > 0)
    .map(deposit => deposit * (account.interestRate / 100))
    .filter(interest => {
      return interest >= 1;
    })
    .reduce((acc, interest) => {
      return acc + interest;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
}

//Refactoring refresh
function refreshDashboard() {
  displayTransfers(currentAccount.transfers);
  calcDisplaySummary(currentAccount);
  calcDisplayBalance(currentAccount);
}

//Implementing Login
let currentAccount;
let firstName;

//Event Handler - Login Button
btnLogin.addEventListener('click', function (event) {
  //Prevent form from submitting and refreshing the page.
  event.preventDefault();

  //Validating username and pin
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase().trim()
  );

  if (currentAccount) {
    firstName = currentAccount?.owner.split(' ')[0];

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
      //Displaying welcome message
      labelWelcome.textContent = `Welcome back, ${firstName}`;

      //Display all transfers and account related data.
      refreshDashboard();

      containerApp.style.opacity = 1;

      //clear input fields
      inputLoginUsername.value = inputLoginPin.value = '';

      //remove focus from input fields
      inputLoginPin.blur();
    } else
      labelWelcome.textContent = `Incorrect Password for Account: ${firstName}`;
  } else labelWelcome.textContent = `Account doesn't exist`;
});

//Event Handler - Transfer Button
btnTransfer.addEventListener('click', function (e) {
  //Prevent form submit button default behaviour (Refreshing the page).
  e.preventDefault();

  //I should use a closure here ..but I am yet to figure out how.
  const transferAmount = Number(inputTransferAmount.value);
  const beneficiaryAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (beneficiaryAccount) {
    if (
      transferAmount <= currentAccount.balance &&
      transferAmount > 0 &&
      beneficiaryAccount.username !== currentAccount.username
    ) {
      //Deduct from owners account
      currentAccount.transfers.push(-transferAmount);

      //Add positive transfer to beneficiary account
      beneficiaryAccount.transfers.push(transferAmount);
    } else {
      alert(`Insufficient funds`);
    }
  } else {
    alert(`Beneficiary does not exist`);
  }

  //Update dashboard display
  refreshDashboard();
});

//Event Hamdler - Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Your account has been successfully deleted`;
  } else {
    alert('Incorrect Username or Pin');
  }
});
