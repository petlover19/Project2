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
        return ( <div className = "card_list" >
                <h3 className = "emptyRecipe" > No Recipes yet </h3> 
            </div>
        );
    };
    // console.log("prop.ing",props.recipes.ingredients)
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

    const recipeNodes = props.recipes.map((recipe) =>{
        // console.log(props.recipes.ingredients)
        console.log("rec",recipe)
        console.log("reci",recipe.ingredients)
        const ingList=recipe.ingredients

        // const ingList = this.recipe.ingredients;
        return ( <div key = { recipe._id } className = "cards" >
                    <h2> Name: { recipe.name } </h2> 
                    <h3 > Ingredients:</h3> 
                    <p>{recipe.ingredients}</p>
                    <h3 > Directions:</h3> 
                    <p>{recipe.directions}</p>
            </div>
        );
    });

    return ( <div className = "card_list" > { recipeNodes } </div>
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

const getBrowseXHR = () => {
    sendAjax('GET', '/browse', null, (result) => {
        ReactDOM.render( <RecipeList recipes = { [result.allRecipies] }/>,document.querySelector("#browseRecipes"));
    });
};


$(document).ready(function() {
    getToken();
});