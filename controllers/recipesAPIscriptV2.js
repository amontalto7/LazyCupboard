require("dotenv").config();
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
//     //Variable to save array of recipes being returned within the 'hits' property
//     var responseArray = response.data.hits;
//     //Array to push only recipe info we need into
//     var recipes = [];
//     //For loop to retrieve only the recipe info we need
//     for (var i = 0; i < responseArray.length; i++) {
//       recipes.push({
//         label: responseArray[i].recipe.label,
//         calories: Number(
//           (
//             responseArray[i].recipe.calories / responseArray[i].recipe.yield
//           ).toFixed(0)
//         ),
//         url: responseArray[i].recipe.url,
//         uri: responseArray[i].recipe.uri,
//         image: responseArray[i].recipe.image,
//         recipeIngredient: responseArray[i].recipe.ingredients,
//         UserId: req.user.id,
//       });
//     }
//     // console.log(recipes);
//   });
// };

module.exports.getRecipesInfo = function(food, sendRecipes) {
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
    food
  )}&number=5&addRecipeInformation=true&apiKey=${
    process.env.SPOONACULAR_API_KEY
  }`;

  axios.get(url).then((response) => {
    const recipes = response.data.results.map((r) => ({
      label: r.title,
      calories:
        r.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 0,
      url: r.sourceUrl,
      uri: `spoonacular:${r.id}`,
      image: r.image,
      recipeIngredient: r.extendedIngredients || [],
      UserId: null,
    }));

    sendRecipes(recipes);
  });
};
