'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// TRANSFIZI APP

// Data
const account1 = {
  owner: 'Adanna Erica',
  transfers: [200.56, 450, -400, 3000, -650, -130, 70.5, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Kingsley Obinna',
  transfers: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Uzochukwu Davis Okeke',
  transfers: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Nonye Ekuma',
  transfers: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

//Start Logout Timer
function startLogoutTimer() {
  let time = 360;

  function tick() {
    let min = String(Math.floor(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logoutTimer);
      logout();
    }

    time--;
  }

  tick();
  const logoutTimer = setInterval(tick, 1000);
  return logoutTimer;
}

const logoutTimer = startLogoutTimer();

//Calculating and displaying movement dates
function calcDaysPassed(date1, date2) {
  return Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
}

function displayDates(date, locale) {
  let transDate = new Date(date);
  let transDays = calcDaysPassed(transDate, Date.now());

  if (transDays === 0) return 'today';
  if (transDays === 1) return 'yesterday';
  if (transDays <= 7) {
    return `${transDays} days ago`;
  }

  return new Intl.DateTimeFormat(locale).format(transDate);
}

//Formatting currencies
function formatCurrency(acc, number) {
  let options = {
    style: 'currency',
    currency: acc.currency,
  };

  return new Intl.NumberFormat(acc.locale, options).format(number);
}

//Displaying the transfers on the dashboard.
function displayTransfers(acc, sort = false) {
  //Matching the transfers with the their dates
  accounts.forEach(acc => {
    acc.matchedDates = acc.transfers.map((transfer, index) => {
      return { amount: transfer, date: acc.movementsDates[index] };
    });
  });

  containerTransfers.innerHTML = '';

  const sortedTransfers = sort
    ? acc.matchedDates.slice().sort((a, b) => a.amount - b.amount)
    : acc.matchedDates;

  sortedTransfers.forEach(function (transfer, index) {
    const transferType = transfer.amount > 0 ? 'deposit' : 'withdrawal';
    const transferTemplate = `
        <div class="transfers__row">
          <div class="transfers__type transfers__type--${transferType}">${
      index + 1
    } ${transferType}</div>
          <div class="transfers__date">${displayDates(
            transfer.date,
            acc.locale
          )}</div>
          <div class="transfers__value">${formatCurrency(
            acc,
            transfer.amount
          )}</div>
        </div>
    `;
    containerTransfers.insertAdjacentHTML('afterbegin', transferTemplate);
  });
}

//Automatically creating usernames for users
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
  labelBalance.textContent = `${formatCurrency(account, account.balance)}`;
}

//Displaying all the summaries
function calcDisplaySummary(account) {
  const totalDeposits = account.transfers
    .filter(transfer => transfer > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  const totalWithdrawals = account.transfers
    .filter(transfer => transfer < 0)
    .reduce((acc, withdrawal) => acc + withdrawal, 0);

  labelSumIn.textContent = `${formatCurrency(account, totalDeposits)}`;
  labelSumOut.textContent = `${formatCurrency(
    account,
    Math.abs(totalWithdrawals)
  )}`;

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
  labelSumInterest.textContent = `${formatCurrency(account, interest)}`;
}

//Refactoring refresh
function refreshDashboard() {
  displayTransfers(currentAccount);
  calcDisplaySummary(currentAccount);
  calcDisplayBalance(currentAccount);
}

function logout() {
  currentAccount = undefined;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
}
//Implementing Login
let currentAccount;
let firstName;

//Event Handlers

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

    if (currentAccount?.pin === +inputLoginPin.value) {
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

  //Showing current date
  let now = new Date();

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  if (logoutTimer) {
    clearInterval(logoutTimer);
    startLogoutTimer();
  } else {
    startLogoutTimer();
  }
});

//Event Handler - Transfer Button
btnTransfer.addEventListener('click', function (e) {
  //Prevent form submit button default behaviour (Refreshing the page).
  e.preventDefault();

  //I should do a closure-type thing here ..but I am yet to figure out how.
  const transferAmount = +inputTransferAmount.value;
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
      //Deduct from owners account with date.
      let now = new Date().toISOString();
      currentAccount.transfers.push(-transferAmount);

      currentAccount.movementsDates.push(now);

      //Add positive transfer to beneficiary account
      beneficiaryAccount.transfers.push(transferAmount);
      beneficiaryAccount.movementsDates.push(now);
    } else {
      alert(`Insufficient funds`);
    }
  } else {
    alert(`Beneficiary does not exist`);
  }

  //Update dashboard display
  refreshDashboard();
});

//Event Handler - Loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.transfers.some(transfer => transfer >= 0.1 * loanAmount)
  ) {
    //Add loan to account with date
    setTimeout(() => {
      let now = new Date().toISOString();

      currentAccount.movementsDates.push(now);
      currentAccount.transfers.push(loanAmount);

      //Update UI
      refreshDashboard();
    }, 3000);
  } else alert('Invalid Loan Request');

  //Clear Input Data
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

//Event Handler - Close Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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

//Event Handler -  Sort
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransfers(currentAccount, !sorted);
  sorted = !sorted;
});
