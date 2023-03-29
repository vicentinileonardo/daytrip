//set background color for the whole page
document.body.style.backgroundColor = "#f5f5f5";

document.addEventListener('DOMContentLoaded', checkIfLoggedHomepage());

document.addEventListener('DOMContentLoaded', defaultDate());

function defaultDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  } 

  if(mm<10) {
      mm = '0'+mm
  } 

  today = yyyy + '-' + mm + '-' + dd;
  document.getElementById("date-input").value = today;
}

const destinationForm = document.getElementById('destination-form');
const destinationCards = document.getElementById('destination-cards');
  
destinationForm.addEventListener('submit', (event) => {
event.preventDefault();

document.getElementById("div_info").hidden = true;
destinationCards.innerHTML = '<div style="width: 800px; height: 800px; margin: auto; margin-top: 1rem; position: relative; overflow: hidden;"> <img src="./img/loading.gif" alt="loading" style="width: 100%; height: auto; display: block; position: absolute; top: 25%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; clip-path: circle(25% at center);"> </div>';

const formData = new FormData(destinationForm);
const address = formData.get('address');
const timeBudgetInHour = formData.get('timeBudgetInHour');
const date = formData.get('date');

const url = `http://localhost/best_destinations_service/api/v1/destinations/best?address=${address}&timeBudgetInHour=${timeBudgetInHour}&date=${date}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
    
    destinationCards.innerHTML = '';
    
    //check if status field is error
    if(data.status == 'error'){
        console.log("error data", data);
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = data.message;

        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        destinationCards.appendChild(card);
    } 
    else if(data.status == "fail") {
        console.log("fail data", data);
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        
        var str = "";
        for (var key in data.data) {
            if (data.data.hasOwnProperty(key)) {
                //capitalize the first letter of the first word
                str += data.data[key].charAt(0).toUpperCase() + data.data[key].slice(1) + " ";
            }
        }
        cardTitle.innerText = str;

        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        destinationCards.appendChild(card);

    }
    else{
        document.getElementById("div_info").hidden = false;

        destinations = data.data.destinations;
        
        destinations.forEach(destination => {
        
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('mb-3');
        

        card.style.width = "30rem";
        card.style.height = "auto";

        //center the card
        card.style.margin = "auto";
        card.style.marginTop = "2rem";
        card.style.marginBottom = "2rem";

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.classList.add('mx-auto');
        cardBody.classList.add('d-block');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = destination.name;
        cardTitle.style.marginTop = "1rem";

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = destination.description;
        cardText.style.marginTop = "1rem";

        //add image
        const cardImage = document.createElement('img');
        //round all corners
        cardImage.classList.add('card-img-top');
        cardImage.classList.add('rounded');
        cardImage.classList.add('mx-auto');
        cardImage.classList.add('d-block');

        cardImage.src = destination.image_url;
        cardImage.alt = destination.name;
        
        cardImage.style.width = "25rem";
        cardImage.style.height = "15rem";
        cardImage.style.marginTop = "1rem";
        
        //add rank to the card
        const cardRank = document.createElement('p');
        cardRank.classList.add('card-text');
        cardRank.innerText = "Rank #" + destination.rank;
        cardRank.style.fontWeight = "bold";
        cardRank.style.fontSize = "1.5rem";

        //add a google maps link to the card
        const cardDirections = document.createElement('a');
        cardDirections.classList.add('card-text');
        cardDirections.innerText = "Directions (Google Maps)";
        
        cardDirections.href = "https://www.google.com/maps/dir/?api=1&origin=" + address + "&destination=" + destination.name;

        cardDirections.target = "_blank";
        cardDirections.style.fontWeight = "bold";

        // create a div to hold the rating system
        const ratingContainer = document.createElement("div");
        ratingContainer.classList.add("rating-container");

        // create a function to update the rating based on the provided score
        function updateRating(score) {
            for (let i = 0; i < 10; i++) {
            if (i < score) {
                stars[i].classList.add("fas");
                stars[i].classList.remove("far");
            } else {
                stars[i].classList.add("far");
                stars[i].classList.remove("fas");
            }
            }
        }

        // create an array to hold the star icons
        const stars = [];

        // create five star icons and add them to the rating container
        for (let i = 0; i < 10; i++) {
            const star = document.createElement("i");
            star.classList.add("star", "far", "fa-star");
            ratingContainer.appendChild(star);
            stars.push(star);
        }

        stars.forEach(star => {
            star.style.color = "gold";
        });

        // set the size of the stars
        stars.forEach(star => {
            star.style.fontSize = "2rem";
        });

        
        const roundedRating = Math.round(destination.rating * 10);
        updateRating(roundedRating);

        cardBody.appendChild(cardRank);
        cardBody.appendChild(ratingContainer);
        cardBody.appendChild(cardImage);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardDirections);
        
        card.appendChild(cardBody);
        destinationCards.appendChild(card);
        });
    }
    })
    .catch(error => {
    console.error(error);        
    });
});
