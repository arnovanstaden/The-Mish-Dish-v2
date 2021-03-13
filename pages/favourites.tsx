import { GetStaticProps } from 'next';
import { useState, useEffect } from "react";
import { checkLoggedIn, getUserName, getFavourites } from "../utils/user";


// Components
import Layout from "../components/Layout/Layout";
import Search from "../components/UI/Search/Search";
import Recipe from "../components/Recipe/Recipe";
import Login from "../components/UI/Login/Login";

// Styles
import styles from "../styles/pages/favourites.module.scss"

export default function Favourites({ allRecipes }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [favourites, setFavourites] = useState(undefined);
    const [userName, setUserName] = useState(undefined);

    const transformUserName = (): string => {
        let savedUsername = getUserName()
        let lastChar = savedUsername.charAt(savedUsername.length - 1);
        if (lastChar === "s") {
            return `${savedUsername}'`
        }
        return `${savedUsername}'s`
    }

    const getRecipe = (id) => {
        let recipe = allRecipes.find(recipe => recipe.id === id);
        return recipe
    }

    // Handlers

    const handleLoginSuccess = () => {
        setLoggedIn(true);
        setUserName(transformUserName())
        // Get Favourites
        setFavourites(getFavourites())
    }

    useEffect(() => {
        let localFavourites = getFavourites()
        if (localFavourites) {
            setFavourites(localFavourites)
        }
    }, [])

    useEffect(() => {
        setLoggedIn(checkLoggedIn());
        if (loggedIn) {
            if (!userName) {
                setUserName(transformUserName());
            }
        }
    })

    return (
        <Layout
            head={{
                title: "Favourites | The Mish Dish",
                description: "A personal catalogue of some of Mish's personally created, go-to dishes - no life story included.",
                canonical: "/favourites",
                robots: false
            }}
            classNameProp={styles.favourites}
        >

            <h1>{userName} Favourites</h1>
            <Search reroute />
            <div className={styles.grid}>
                {favourites ?
                    favourites.map((favourite, index) => (
                        <Recipe recipe={getRecipe(favourite)} key={index} />
                    ))
                    : <p> You don't have any favourites yet :(</p>
                }
            </div>
            {loggedIn ? null : <Login handleLoginSuccess={handleLoginSuccess} />}
        </Layout >
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
    let allRecipes = await response.json();
    allRecipes = [...allRecipes].reverse()

    return {
        props: {
            allRecipes
        },
    }
}
