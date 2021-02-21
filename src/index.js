import axios from 'axios';

const userList = document.querySelector('#users');
const restaurantList = document.querySelector('#restaurants');
const reservationsList = document.querySelector('#reservations');

let users;
let restaurants;
let reservations;

const renderUsers = () => {
  const html = users.map( user => `
    <ul>
      <a href="#${user.id}">
        ${user.name}
      </a>
    </ul>
  `).join('');
  userList.innerHTML = html;
}

const renderRestaurants = () => {
  const html = restaurants.map(restaurant => `
    <ul>
      ${restaurant.name}
    </ul>
  `).join('');
  restaurantList.innerHTML = html;
}

const renderReservations = () => {
  const html = reservations.map(reservation => `
    <ul>
      ${reservation.restaurantId}
    </ul>
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
  const userId = window.location.hash.slice(1);
  const url = `/api/users/${userId}/reservations`;
  reservations = (await axios(url)).data;
  renderReservations();
})


init();