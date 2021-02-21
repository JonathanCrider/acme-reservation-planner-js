import axios from 'axios';

const userList = document.querySelector('#users');
const restaurantList = document.querySelector('#restaurants');
const reservationsList = document.querySelector('#reservations');

let users;
let restaurants;
let reservations;
let userId;

function resCount(resId) {
  return reservations.reduce((acc, res) => res.restaurantId === resId ? ++acc : acc, 0);
}

const renderUsers = () => {
  const html = users.map( user => `
    <li class=''>
      <a href="#${user.id}">
        ${user.name}
      </a>
    </li>
  `).join('');
  userList.innerHTML = html;
}

const renderRestaurants = () => {
  const html = restaurants.map(restaurant => `
    <li>
      ${restaurant.name} (${reservations ? resCount(restaurant.id) : 0})
    </li>
      `).join('');
  restaurantList.innerHTML = html;
}

const renderReservations = () => {
  const html = reservations.map(reservation => `
    <li>
      ${restaurants.reduce((acc, res) => res.id === reservation.restaurantId ? acc = res.name : acc, '')}<br>
      @ ${new Date(reservation.createdAt).toLocaleTimeString()}
    </li>
  `).join('');
  reservationsList.innerHTML = html;
}

const init = async() => {
  try {
    [users, restaurants] = await Promise.all([
      (await axios.get('/api/users')).data,
      (await axios.get('/api/restaurants')).data
    ]);
    renderUsers();
    renderRestaurants();

  }
  catch(ex) {
    console.log(ex)
  }

}

window.addEventListener('hashchange', async () =>{
  userId = window.location.hash.slice(1);
  const url = `/api/users/${userId}/reservations`;
  reservations = (await axios(url)).data;
  renderReservations();
  renderRestaurants();
})

document.addEventListener('click', (e) => {
  if (e.target.parentElement.parentElement.id === 'users') {
    Array.from(e.target.parentElement.parentElement.children).forEach(el => el.className = '')
    e.target.parentElement.className = 'selected'
  }
});
init();