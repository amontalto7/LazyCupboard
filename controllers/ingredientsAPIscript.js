require("dotenv").config();

//var keys = require("../keys");
// REQUIRE MODELS FOLDER WHICH CONTAIN TABLE MODELS

var db = require("../models");

// REQUIRE AXIOS FOR API CALL
var axios = require("axios");

// REQUIRE API ROUTES FILE
var apiRoutes = require("../routes/apiRoutes");

//API call must be wrapped in a module.exports function to allow other files to access it
//Must also pass all required parameters to this function and assign them as variables within the {}
module.exports.getIngredientInfo = function(
  userID,
  ingredientName,
  ingredientAction,
  addIngredientNutrition
) {
  //The ingredientName being passed to this file can only be passed as an object, so we must
  //create a variable to access the property we want in that object.
  const food = ingredientName.ingredient;

  const url = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(
    food
  )}&number=1&apiKey=${process.env.SPOONACULAR_API_KEY}`;

  axios
    .get(url)
    .then((searchResponse) => {
      const ingredientId = searchResponse.data.results?.[0]?.id;
      if (!ingredientId) {
        console.warn("No Spoonacular match for:", food);
        return;
      }

      const detailUrl = `https://api.spoonacular.com/food/ingredients/${ingredientId}/information?amount=100&unit=grams&apiKey=${process.env.SPOONACULAR_API_KEY}`;

      return axios.get(detailUrl);
    })
    .then((detailResponse) => {
      if (!detailResponse) return;

      const nutrients = detailResponse.data.nutrition?.nutrients || [];

      const getNutrient = (name) =>
        nutrients.find((n) => n.name === name)?.amount || 0;

      const ingredient = {
        name: detailResponse.data.name,
        calories: getNutrient("Calories"),
        protein: getNutrient("Protein"),
        fat: getNutrient("Fat"),
        carbs: getNutrient("Carbohydrates"),
        checked: "",
        UserId: userID,
      };

      if (ingredientAction === "post_to_db") {
        addIngredientNutrition(ingredient);
      }
    })
    .catch((err) => {
      console.error(
        "Spoonacular API error:",
        err.response?.data || err.message
      );
    });
};
