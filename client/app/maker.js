const handleRecipe = (e) => {
    e.preventDefault();

    $("#chefMessage").animate({
        width: 'hide'
    }, 350);

    if ($("#nameField").val() == '' || $("#ingredientsField").val() == ''|| $("#directionsField").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
        loadRecipesFromServer();
    });
    return false;
};

const RecipeForm = (props) => {
    return ( <form id="recipeForm" 
        name="recipeForm"
        onSubmit={handleRecipe} 
        action="/maker" 
        method="POST">
    <label htmlFor="nameField">Name: </label>
    <input id="nameField" type="text" name="name" />
    <label htmlFor="ingredientsField">Ingredients: </label>
    <textarea id="ingredientsField" type="text" name="ingredients" rows="5"></textarea>
    <label htmlFor="directionsField">Directions: </label>
    <textarea id="directionsField" type="text" name="directions" rows="5"></textarea>
    {/* <br> */}
    <input type="hidden" name="_csrf" value={props.csrf}/>
    <input type="submit" value=" Make Card" id="submit"/>
    
    </form>
    );
};

const RecipeList = function(props) {
    if (props.recipes.length === 0) {
        return ( <div className = "recipeList" >
                <h3 className = "emptyRecipe" > No Recipes yet </h3> 
            </div>
        );
    };
    
    const ingList = props.recipes.ingredients.map((ing)=>{
        console.log("ing",ing)
        return(
            <li>{ing}</li>
        ); 
    });

    const dirList = props.recipes.map((recipe)=>{
        for(let dir in recipe){
            return(
                <li>{dir}</li>
            );
        }
        console.log("dir",dir)
    });

    const recipeNodes = props.recipes.map((recipe) =>{
        console.log(props.recipes.ingredients)
        console.log(recipe)
        return ( <div key = { recipe._id } className = "cards" >
                    <h2 className = "nameField" > Name: { recipe.name } </h2> 
                    <h3 className = "ingredientsField" > Ingredients:</h3> 
                    <ul>
                        {ingList}
                    </ul>
                    <h3 className = "directionsField" > Directions:</h3> 
                    <ol>
                        {dirList}
                    </ol>
            </div>
        );
    });

    return ( <div className = "recipeList" > { recipeNodes } </div>
    );
};

const loadRecipesFromServer = () => {
    sendAjax('GET', '/getRecipes', null, (data) => {
        ReactDOM.render( <RecipeList recipes = { data.recipes }/>,document.querySelector("#recipes"));
    });
};

const setup = function(csrf) {
    ReactDOM.render( <RecipeForm csrf = { csrf }/>,document.querySelector("#makeRecipe"));
    ReactDOM.render( <RecipeList recipes = { [] }/>,document.querySelector("#recipes"));

    loadRecipesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });

};
$(document).ready(function() {
    getToken();
});