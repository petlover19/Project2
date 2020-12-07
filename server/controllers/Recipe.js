const models = require('../models');

const { Recipe } = models;

const makerPage = (req, res) => {
    Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
    });
};

const makeRecipe = (req, res) => {
    // page 9
    if (!req.body.name || !req.body.ingredients || !req.body.directions) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const recipeData = {
        name: req.body.name,
        ingredients: req.body.ingredients.split("\n"),
        directions: req.body.directions.split("\n"),
        owner: req.session.account._id,
    };

    const newRecipe = new Recipe.RecipeModel(recipeData);

    const recipePromise = newRecipe.save();

    recipePromise.then(() => res.json({ redirect: '/maker' }));

    recipePromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Recipe already exists' });
        }

        return res.status(400).json({ error: 'An error occurred' });
    });

    return recipePromise;
};

const getRecipes = (request, response) => {
    const req = request;
    const res = response;

    return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occured' });
        }
        return res.json({ recipes: docs });
    });
};

module.exports = { makerPage, make: makeRecipe, getRecipes };