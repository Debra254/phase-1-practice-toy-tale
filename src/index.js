let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");
  const baseUrl = "http://localhost:3000/toys";

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  
  fetch(baseUrl)
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach(renderToyCard);
    });

  
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => handleLike(toy, card));

    toyCollection.appendChild(card);
  }

  
  function handleLike(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`${baseUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0,
    };

    fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((res) => res.json())
      .then((toy) => {
        renderToyCard(toy);
        toyForm.reset();
      });
  });
});
