"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Mahider Yene",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Mikiyas Adefris Wodajo",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Aynalem Tadese",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovement(account1.movements);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} Birr`;
};
// calcPrintBalance(account1.movements);
const calcDisplaySummery = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}birr`;
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}birr`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}birr`;
};
// calcDisplaySummery(account1.movements);

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};
creatUsernames(accounts);
console.log(accounts);

// console.log(containerMovements.innerHTML);
///////////
// EVENT HANDLER

const updateUI = function (acc) {
  // Display movements
  displayMovement(acc.movements);
  // Display balance
  calcPrintBalance(acc);
  // Display summery
  calcDisplaySummery(acc);
};

let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message.
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //  Clear input field
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    // updateUI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receverAcc &&
    currentAccount.balance >= amount &&
    receverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receverAcc.movements.push(amount);

    // updateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // updateUI
    updateUI(currentAccount);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log("index ");
    // Delet Accoount
    accounts.splice(index, 1);
    // HideUI
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ["a", "b", "c", "d", "e"];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(-2));
console.log(arr.slice());
console.log(...arr);
// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
// REVERSE
arr = ["a", "b", "c", "d", "e"];
const arr2 = ["i", "j", "h", "k"];
console.log(arr2.reverse());
// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log(...arr, ...arr2);
// JOIN
console.log(letters.join("-"));
*/
/*
const arr = [20, 11, 64];
console.log(arr.at(0));
console.log(arr.at(arr.length - 1));
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
console.log("jonas".at(0));
*/
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (let movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposite ${movement}`);
//   } else {
//     console.log(`You withdraw ${Math.abs(movement)}`);
//   }
// }

// console.log("---- FOREACH-----");

// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposite ${movement}`);
//   } else {
//     console.log(`Movement ${index + 1}: You withdraw ${Math.abs(movement)}`);
//   }
// });
//MAP
/*
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);
currencies.forEach(function (val, key, map) {
  console.log(`${key}: ${val}`);
});
// SET
const currenciesUnique = new set(["USD", "DBP", "USD", "EUR", "EUR"]);
console.log(currenciesUnique);
*/

// CODING CHALLANIG
/*
const Julia = [3, 5, 2, 12, 7];
const Kate = [4, 2, 15, 8, 3];
Julia.splice(-1);
Julia.reverse();
Julia.splice(-1);
Julia.reverse();
console.log(Julia);
const Dogs = Julia.concat(Kate);
console.log(Dogs);
Dogs.forEach(function (age, i, Dogs) {
  if (age >= 3) {
    console.log(`Dog number ${i + 1} is an adult , and it is ${age} Years old`);
  } else {
    console.log(`Dog number ${i + 1} is still a puppy😊`);
  }
});*/
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(x => eurToUsd * x);
// console.log(movements);
// console.log(movementsUSD);
// const user = "Mikiyas Adefris Wodajo";
// const username = user
//   .toLowerCase()
//   .split(" ")
//   .map(name => name[0])
//   .join("");
// console.log(username);const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposit);
// const depositFor = [];
// for (const x of movements) if (x > 0) depositFor.push(x);
// console.log(depositFor);
// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(withdrawals);
const balance = movements.reduce(function (acc, cur, i) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value;
const Max = movements.reduce(function (acc, mov) {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(Max);
///////////////////////////////////////////////
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(x => eurToUsd * x);
// console.log(movements);
const USDtobirr = 0.017;
// const movementsbirr = movements.map(mov => birrTOUSD * mov);
// console.log(movementsbirr);
const totalDeposite = movements
  .filter(mov => mov > 0)
  .map(mov => mov * USDtobirr)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDeposite);
/////////////////////////////////////////////////////////
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === "Mahider Yene");
// console.log(account);
// console.log(movements);
// console.log(movements.includes(-130));
// console.log(movements.indexOf(-130));
// const dp = movements.some(mov => mov >= 50000);
// console.log(dp);
// alert(movements.some(mov => mov === -130));
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr);
// const mk = [2,3,8,9,6,48,7]

const accountmovements = accounts.map(acc => acc.movements);
console.log(accountmovements);
const allMovements = accountmovements.flat();
console.log(allMovements);
const Displaymovements = allMovements.reduce((acc, mov) => acc + mov);
console.log(Displaymovements);
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);
console.log(overalBalance);
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);
console.log(overalBalance2);
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
const owner = ["Jonas", "Zack", "Adam", "Martha"];
console.log(owner.sort());

console.log(movements);
console.log(movements.sort());

// Ascending order
const km = movements.sort((a, b) => {
  if (a > b) return 11;
  if (a < b) return -1;
});
console.log(km);

// Descending order
movements.sort((a, b) => b - a);
console.log(movements);
///////////////////////////////////////
////////////////////////////////////////
/////////////////////////////////////////
const x = new Array(7);
console.log(x);
console.log(x.fill(31));
console.log(x.fill(3, 5, 6));
console.log(x.fill(23, 2, 6));
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);
const m = Array.from({ length: 100 }, Math.trunc(Math.random));
console.log(m);
