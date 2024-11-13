document.addEventListener("DOMContentLoaded", function () {
   // Initialize variables
   let nextBtn = document.getElementById("nextBtn");
   let prevBtn = document.getElementById("prevBtn");
   let allDish = document.querySelectorAll(".dishs");
   let searchInput = document.getElementById("searchInput");
   let searchBtn = document.getElementById("searchBtn");
   let dishValue = document.querySelectorAll(".dishVal");

   // Counter for the slider functionality
   let count = 0;

   // Helper function to get the ingredients list
   const getIngredients = (meal) => {
       const ingredients = [];
       for (let i = 1; i <= 20; i++) {
           if (meal[`strIngredient${i}`]) {
               ingredients.push(`${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}`);
           }
       }
       return ingredients;
   };

   // Function to fetch and display meal data
   const getData = async (value) => {
       try {
           let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
           let jsonData = await response.json();

           const showMealContainer = document.querySelector(".showMeal");
           showMealContainer.innerHTML = ""; // Clear previous results

           if (jsonData.meals) {
               showMealContainer.style.display = "flex"; // Show the container when meals are found

               jsonData.meals.forEach(function (meal) {
                   let mealCard = document.createElement("div");
                   mealCard.classList.add("card");
                   mealCard.innerHTML = `
                       <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                       <p>${meal.strMeal}</p>
                       <button class="viewMoreBtn" data-id="${meal.idMeal}">View More</button>
                   `;
                   showMealContainer.appendChild(mealCard);
               });

               // Add event listeners for "View More" buttons
               document.querySelectorAll(".viewMoreBtn").forEach(button => {
                   button.addEventListener("click", function () {
                       const mealId = this.dataset.id;
                       fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
                           .then(response => response.json())
                           .then(data => {
                               const meal = data.meals[0];
                               displayModal(meal); // Show the modal with meal details
                           })
                           .catch(error => {
                               console.error('Error fetching meal details:', error);
                               alert('Error loading meal details.');
                           });
                   });
               });
           } else {
               // If no meals are found, display a message and hide the container
               showMealContainer.style.display = "none";
               showMealContainer.innerHTML = "<h1>No meals found</h1>";
           }
       } catch (error) {
           // Handle errors and hide the container
           showMealContainer.style.display = "none";
           showMealContainer.innerHTML = "<h1>Error fetching meals</h1>";
           console.error("Error fetching data:", error);
       }
   };

   // Display Modal with meal details
   const displayModal = (meal) => {
       const ingredients = getIngredients(meal);
       document.getElementById("modalMealDetails").innerHTML = `
           <h2>${meal.strMeal}</h2>
           <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
           <h3>Ingredients</h3>
           <ul>
               ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
           </ul>
           <h3>Instructions</h3>
           <p>${meal.strInstructions}</p>
       `;
       document.getElementById("mealModal").style.display = "flex"; // Show the modal
   };

   // Close the modal when clicking on the "X"
   document.getElementById("closeBtn").addEventListener("click", () => {
       document.getElementById("mealModal").style.display = "none"; // Hide the modal
   });

   // Close the modal when clicking outside the modal content
   window.addEventListener("click", (event) => {
       if (event.target === document.getElementById("mealModal")) {
           document.getElementById("mealModal").style.display = "none"; // Hide the modal
       }
   });

   // Event listener for the search button
   searchBtn.addEventListener("click", function () {
       let searchValue = searchInput.value;
       if (searchValue === "") {
           alert("Please enter a search term.");
       } else {
           getData(searchValue);
       }
   });

   // Event listener for clicking category dish buttons
   dishValue.forEach(function (dishData) {
       dishData.addEventListener("click", function () {
           getData(dishData.value);
       });
   });

   // Slider functionality for categories
   allDish.forEach(function (slide, index) {
       slide.style.left = `${index * 100}%`;
   });

   function myFun() {
       allDish.forEach(function (curVal) {
           curVal.style.transform = `translateX(-${count * 100}%)`;
       });
   }

   // Event listeners for the next and previous buttons on the slider
   nextBtn.addEventListener("click", function () {
       count++;
       if (count == allDish.length) {
           count = 0;
       }
       myFun();
   });

   prevBtn.addEventListener("click", function () {
       count--;
       if (count == -1) {
           count = allDish.length - 1;
       }
       myFun();
   });
});
