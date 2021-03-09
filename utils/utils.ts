
// Image Conversion
export const convertImage = (image: string, width: number): string => {
    const covertedImage = image.replace("upload/v", `upload/w_${width},c_scale/f_auto/v`);
    return covertedImage
}

// Sharing
export const handleRecipeShare = (name: string, id: string) => {
    if (navigator.share) {
        navigator.share({
            title: name,
            text: `Check out this awesome recipe on The Mish Dish:\n ${name}\n`,
            url: `https://themishdish.co.za/recipes/${id}`,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
}

// Recently Viewed
export const recentlyViewed = {
    get: () => {
        return JSON.parse(localStorage.getItem("recentlyViewed"));
    },
    set: (id: string) => {
        let recipes = JSON.parse(localStorage.getItem("recentlyViewed"));
        if (recipes && !recipes.includes(id)) {
            recipes.unshift(id)
            if (recipes && recipes.length > 6) {
                recipes.pop()
            }
        } else {
            recipes = [id]
        }
        localStorage.setItem("recentlyViewed", JSON.stringify(recipes))
    }
}

// Get Ingredient Count
export const getIngredientCount = (ingredients) => {
    let count = 0;
    if (Object.keys(ingredients).length === 1) {
        count = ingredients[0].length
        return count
    } else {
        let recipeParts = Object.keys(ingredients);
        recipeParts.forEach(part => {
            count += ingredients[part].length
        });
        return count
    }
}


// Get Cooking Times
export const getCookingTimes = (recipes) => {
    let times = {
        min: 100,
        max: 0
    };
    recipes.forEach(recipe => {
        times.min = recipe.cookTime < times.min ? recipe.cookTime : times.min
        times.max = recipe.cookTime > times.max ? recipe.cookTime : times.max
    });
    return times
}


// Search

export const filterSearch = (allRecipes: any[], searchTerm: string) => {
    let results = [];
    const searchKeys = ["name", "description", "recipeType"];

    allRecipes.forEach(recipe => {

        // Iterate through search keys
        searchKeys.forEach(key => {
            let toSearch = recipe[key];
            if (toSearch && toSearch.toLowerCase().includes(searchTerm)) {
                results.push(recipe)
            }
        })

        // Iterate through Tags
        if (recipe.tags) {
            recipe.tags.forEach(tag => {
                if (tag && tag.toLowerCase().includes(searchTerm)) {
                    results.push(recipe)
                }
            });
        }

        // Ingredients
        let ingredientKeys = Object.keys(recipe.ingredients)
        if (ingredientKeys.length === 1) {
            recipe.ingredients[0].forEach(ingredient => {
                if (ingredient.toLowerCase().includes(searchTerm)) {
                    results.push(recipe)
                }
            });
        } else {
            ingredientKeys.forEach(key => {
                recipe.ingredients[key].forEach(ingredient => {
                    if (ingredient.toLowerCase().includes(searchTerm)) {
                        results.push(recipe)
                    }
                });
            })
        }
    });

    // Remove Duplicates
    results = [...new Set(results)]
    return results
}
