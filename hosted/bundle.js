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
      className: "recipeList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyRecipe"
    }, " No Recipes yet "));
  }

  ;
  var ingList = props.recipes.ingredients.map(function (ing) {
    console.log("ing", ing);
    return /*#__PURE__*/React.createElement("li", null, ing);
  });
  var dirList = props.recipes.map(function (recipe) {
    for (var _dir in recipe) {
      return /*#__PURE__*/React.createElement("li", null, _dir);
    }

    console.log("dir", dir);
  });
  var recipeNodes = props.recipes.map(function (recipe) {
    console.log(props.recipes.ingredients);
    console.log(recipe);
    return /*#__PURE__*/React.createElement("div", {
      key: recipe._id,
      className: "cards"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "nameField"
    }, " Name: ", recipe.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "ingredientsField"
    }, " Ingredients:"), /*#__PURE__*/React.createElement("ul", null, ingList), /*#__PURE__*/React.createElement("h3", {
      className: "directionsField"
    }, " Directions:"), /*#__PURE__*/React.createElement("ol", null, dirList));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "recipeList"
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
