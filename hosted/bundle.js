"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();
  $("#chefMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#nameField").val() == '' || $("#ingredientsField").val() == '' || $("#directionsField").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer();
  });
  return false;
};

var RecipeForm = function RecipeForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "recipeForm",
    name: "recipeForm",
    onSubmit: handleRecipe,
    action: "/maker",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nameField"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "nameField",
    type: "text",
    name: "name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "ingredientsField"
  }, "Ingredients: "), /*#__PURE__*/React.createElement("textarea", {
    id: "ingredientsField",
    type: "text",
    name: "ingredients",
    rows: "5"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "directionsField"
  }, "Directions: "), /*#__PURE__*/React.createElement("textarea", {
    id: "directionsField",
    type: "text",
    name: "directions",
    rows: "5"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: " Make Card",
    id: "submit"
  }));
};

var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card_list"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyRecipe"
    }, " No Recipes yet "));
  }

  ; // console.log("prop.ing",props.recipes.ingredients)
  // console.log("prop.recipe",props.recipes)
  // const ingList=(r) => {
  //     // const iList=r.map((ing)=>{
  //     //     return(
  //     //         <li key={ing}>{ing}</li>
  //     //     );
  //     // })
  //     // return(iList);
  //     // for(let ing in r){
  //     //     return(
  //     //         <li key={ing}>{r[ing]}</li>
  //     //     );
  //     // }
  // };
  // const dirList=(r) => {
  //     for(let dir in r){
  //         for(let d in dir){
  //             return(
  //                 <li key={d}>{dir[d]}</li>
  //             );
  //         } 
  //     }
  // };

  var recipeNodes = props.recipes.map(function (recipe) {
    // console.log(props.recipes.ingredients)
    console.log("rec", recipe);
    console.log("reci", recipe.ingredients);
    var ingList = recipe.ingredients; // const ingList = this.recipe.ingredients;

    return /*#__PURE__*/React.createElement("div", {
      key: recipe._id,
      className: "cards"
    }, /*#__PURE__*/React.createElement("h2", null, " Name: ", recipe.name, " "), /*#__PURE__*/React.createElement("h3", null, " Ingredients:"), /*#__PURE__*/React.createElement("p", null, recipe.ingredients), /*#__PURE__*/React.createElement("h3", null, " Directions:"), /*#__PURE__*/React.createElement("p", null, recipe.directions));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "card_list"
  }, " ", recipeNodes, " ");
};

var loadRecipesFromServer = function loadRecipesFromServer() {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes
    }), document.querySelector("#recipes"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector("#makeRecipe"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
    recipes: []
  }), document.querySelector("#recipes"));
  loadRecipesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var getBrowseXHR = function getBrowseXHR() {
  sendAjax('GET', '/browse', null, function (result) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: [result.allRecipies]
    }), document.querySelector("#browseRecipes"));
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#chefMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#chefMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhrstatus, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
