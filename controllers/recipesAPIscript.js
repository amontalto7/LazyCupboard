require("dotenv").config();
//var keys = require("../keys");

// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS
var db = require("../models");

// REQUIRE AXIOS FOR API CALL
const axios = require("axios");

// REQUIRE API ROUTES FILE
var apiRoutes = require("../routes/apiRoutes");

//API call must be wrapped in a module.exports function to allow other files to access it
//Must also pass all required parameters to this function and assign them as variables within the {}

// module.exports.getRecipesInfo = function(food, sendRecipes) {
//   var food = food;
//   // console.log("In API Call: " + food);
//   var queryID = "fcb72d93";
//   var queryKey = keys.edamam.recipes_key;
//   var queryUrl =
//     "https://api.edamam.com/search?q=" +
//     food +
//     "&app_id=" +
//     queryID +
//     "&app_key=" +
//     queryKey;
//   axios.get(queryUrl).then(function(response) {
//     var recipes = response.data.hits;
//     sendRecipes(recipes);
//     // console.log(recipes);
//   });
// };

module.exports.getRecipesInfo = function(food, sendRecipes) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    food
  )}&number=5&addRecipeInformation=true&apiKey=${
    process.env.SPOONACULAR_API_KEY
  }`;

  axios
    .get(url)
    .then((response) => {
      const mappedRecipes = response.data.results.map((r) => ({
        label: r.title,
        calories: 0, // Spoonacular doesn't provide this directly in complexSearch
        url: r.sourceUrl || "",
        uri: `spoonacular:${r.id}`,
        image: r.image || "",
        recipeIngredient: (r.extendedIngredients || []).map((i) => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit,
        })),
      }));

      sendRecipes(mappedRecipes);
    })
    .catch((error) => {
      console.error(
        "Spoonacular API error:",
        error?.response?.data || error.message
      );
      sendRecipes([]); // fallback to avoid crashing the app
    });
};
