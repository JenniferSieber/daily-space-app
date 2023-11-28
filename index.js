const key = `${your NASA API Key Here}`;
const todayDate = document.querySelector(".today");
// all logic btns section
const allLogicBtns = document.querySelector(".all-logic-btns");
const btnToday = allLogicBtns.querySelector(".btn-today");
const listMonthBtn = allLogicBtns.querySelector('.list-month-btn')
const removeSelectedPotd = allLogicBtns.querySelector(".remove-selected-potd");
const loadingIndicator = allLogicBtns.querySelector(".loading-indicator");

// Today Elements
const todayContainer = document.querySelector(".today-container");
const hiddenContainer = todayContainer.querySelector(".hidden-container");

// month of titleBtns
const hiddenListContainer = document.querySelector(".hidden-list-container");
const titleBtns = document.querySelector(".title-btns");
// date range title
const monthRange = document.querySelector(".month-range");

// selected titleBtn for POTD
const selectedPotd = document.querySelector(".selected-potd");
const selectedPotdContainer = selectedPotd.querySelector(".selected-potd-container");
const potdImg = selectedPotd.querySelector(".potd-img");
const potdDate = selectedPotd.querySelector(".potd-date");
const potdTitle = selectedPotd.querySelector(".potd-title");
const potdExpl = selectedPotd.querySelector(".potd-expl");
const potdCopy = selectedPotd.querySelector(".potd-copy");
const potdURL = selectedPotd.querySelector(".potd-url");

// storage vars for
let startDate = "";
let endDate = "";
let todaysPOTD = null;
//let chosenPOTD = null;
let selectedPOTD = null;
let range = null;
let isPOTDSelected = false;
getDates();
getToday();

function getDates() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  //Format date to String
  const currentMonthStr = currentDate.toLocaleDateString("en-US", {
    month: "long",
  });
  const prevMonthStr = new Date(
    currentYear - 1,
    prevMonth - 1,
    1
  ).toLocaleDateString("en-US", { month: "long" });
  // Format for API get request
  startDate = `${currentYear}-${prevMonth}-${currentDay}`;
  endDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const dateToday = `${currentMonthStr} ${currentDay}, ${currentYear}`;
  const monthDateRange = `Range:   ${prevMonthStr} ${currentDay} to ${currentMonthStr} ${currentDay}, ${currentYear}`;
  todayDate.textContent = dateToday;
  monthRange.textContent = monthDateRange;
}

function getToday() {
  if (todaysPOTD !== null) {
    hiddenContainer.classList.remove("hidden");
    displayToday(todaysPOTD);
  } else {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${key}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        todaysPOTD = data;
        displayToday(todaysPOTD);
      })
      .catch((err) => {
        console.log(`Todays POTD Error ${err}`);
      });
  }
}

// dynamically add to browser the POTD returned
function displayToday(potd) {
  btnToday.textContent = 'Hide Todays POTD'
  let title = todayContainer.querySelector(".today-title");
  let img = todayContainer.querySelector(".today-img");
  let link = todayContainer.querySelector(".today-link");
  let date = todayContainer.querySelector(".today-date");
  let copy = todayContainer.querySelector(".today-copy");
  let expl = todayContainer.querySelector(".today-expl");
  title.textContent = potd.title;
  link.href = potd.url;
  img.src = potd.hdurl;
  date.textContent = potd.date
  copy.textContent = 'by ' + potd.copyright;
  expl.textContent = potd.explanation;
}

function toggleTodayPOTDBtn() {
  if (btnToday.textContent == 'Hide Todays POTD') {
    hiddenContainer.classList.add('hidden')
    btnToday.textContent = 'Get Todays POTD'

  } else if(btnToday.textContent == 'Get Todays POTD') {
    hiddenContainer.classList.remove('hidden')
    btnToday.textContent = 'Hide Todays POTD'
  }
}

// --------30 Days of POTD----------
// Get Range of images based on date
function toggleListMonthBtn() {
  if (listMonthBtn.textContent == 'Get the List of POTDs') {
    console.log('GET NOW: Time to Hide the List of POTDs')
    listMonthBtn.textContent = 'Hide the List of POTDs'
    getRangeList()
  } else if (listMonthBtn.textContent == 'Hide the List of POTDs' ) { 
    console.log('HIDE NOW: Time to Get the List of POTDs')
    hiddenListContainer.classList.add('hidden')
    listMonthBtn.textContent = 'Get the List of POTDs'
    titleBtns.classList.add('hidden')
  } 
}

function getRangeList() {
  if (range != null) {
    displayTitles(range);
  } else if (range == null) {
    loadingIndicator.classList.remove("hidden");
    const potdRangeURL = `https://api.nasa.gov/planetary/apod?api_key=${key}&start_date=${startDate}&end_date=${endDate}`;
    fetch(potdRangeURL)
      .then((res) => res.json())
      .then((data) => {
        range = data;
        console.log(range);
        displayTitles(range);
      })
      .catch((err) => {
        console.log(`Error ${err}`);
        loadingIndicator.classList.add("hidden");
      });
  }
}

// Display all POTD in Range as BTNS
function displayTitles(range) {
  hiddenListContainer.classList.remove('hidden')
  monthRange.classList.remove("hidden");
  loadingIndicator.classList.add("hidden");
  titleBtns.classList.remove("hidden");
  // Clear existing buttons before adding new ones
  titleBtns.innerHTML = "";
  range.forEach((obj, i) => {
    let potdSingle = obj;
    const titleBtn = document.createElement("button");
    titleBtn.classList.add("title");
    let btnContent = `${potdSingle.date}: ${potdSingle.title}`;
    titleBtn.textContent = btnContent;
    titleBtns.appendChild(titleBtn);
    titleBtn.addEventListener("click", (e) => {
      selectedPOTD = potdSingle;
      displaySelectedPOTD(selectedPOTD);
      isPOTDSelected = true;
      titleBtns.classList.add("hidden");
      titleBtns.innerHTML = "";
    });
  });
}

// Display POTD selected via list btn
function displaySelectedPOTD(potd) {
  toggleListMonthBtn()
  selectedPotdContainer.classList.remove('hidden')
  removeSelectedPotd.classList.remove('hidden')
  potdTitle.textContent = potd.title;
  potdImg.classList.remove("hidden");
  potdImg.src = potd.hdurl;
  potdDate.textContent = potd.date;
  console.log(potd)
  if (!potd.copyright) {
    potdCopy.textContent = ''
  } else {
    potdCopy.textContent = 'by ' + potd.copyright;
  }
  potdURL.href = potd.url;
  potdExpl.textContent = potd.explanation;
  isPOTDSelected = false;
}

function clearSelectedElement() {
  console.log("remove chosen element");
  selectedPotdContainer.classList.add('hidden')
  //selectedPotdContainer.innerHTML = ''
  potdImg.classList.add("hidden");
  potdImg.src = "";
  potdDate.textContent = "";
  potdTitle.textContent = "";
  potdCopy.textContent = "";
  potdURL.href = "";
  potdExpl.textContent = "";
  selectedPOTD = null;
  startDate = "";
  endDate = "";
  titleBtns.classList.remove("hidden");
  if (!isPOTDSelected) {
    // Show the list of buttons
    titleBtns.classList.remove("hidden");
  }
  removeSelectedPotd.classList.add("hidden");
}

// Event Listeners
btnToday.addEventListener('click', toggleTodayPOTDBtn)
listMonthBtn.addEventListener('click', toggleListMonthBtn)
removeSelectedPotd.addEventListener("click", clearSelectedElement);
