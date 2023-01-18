import React, {useState, useEffect} from 'react';
import RecipeList from './RecipeList';
import '../css/app.css';
import { v4 as uuidv4 } from 'uuid';
import RecipeEdit from './RecipeEdit';

export const RecipeContext = React.createContext()

const LOCAL_STORAGE_KEY = 'cookingWithReact.recipes'

function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState()
  const[recipes, setRecipes] = useState(sampleRecipes)
  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId)

  useEffect(() => {         /* Supposed to store user changes after reload, but not working */
    const recipeJSON = localStorage.getItem(LOCAL_STORAGE_KEY)  /*and needs to be debugged */
    if (recipeJSON != null) {setRecipes(JSON.parse(recipeJSON))}
  },[])

  useEffect(() => {
    localStorage.setItem (LOCAL_STORAGE_KEY, JSON.stringify(recipes))
  },[recipes])

  const recipeContextValue = {
    handleRecipeAdd: handleRecipeAdd,
    handleRecipeDelete: handleRecipeDelete,
    handleRecipeSelect: handleRecipeSelect,
    handleRecipeChange: handleRecipeChange
  }

  function handleRecipeSelect(id){
    setSelectedRecipeId(id)
  }

  function handleRecipeAdd(){
    const newRecipe={
      id:uuidv4(),
      name:"",
      servings:1,
      cookTime:"",
      instructions:'',
      ingredients:[
        {id:uuidv4(), name:"", amount:''}
      ]
    }
    setSelectedRecipeId(newRecipe.id)
    setRecipes([...recipes, newRecipe])
  }

  function handleRecipeChange(id, recipe){
    const newRecipes = [...recipes]
    const index = newRecipes.findIndex(r => r.id === id)
    newRecipes[index] = recipe
    setRecipes(newRecipes)
  }

  function handleRecipeDelete(id){
    if (selectedRecipeId != null && selectedRecipeId === id){
      setSelectedRecipeId(undefined)
    }
    setRecipes(recipes.filter(recipe => recipe.id !== id))
  }

  return (
    <RecipeContext.Provider value={recipeContextValue}>
      <RecipeList recipes={recipes} />
      {selectedRecipe && <RecipeEdit selectedRecipe={selectedRecipe} />}
    </RecipeContext.Provider>
  ) 
  
}

const sampleRecipes =[
  {
    id:1,
    name:'Fried Chicken',
    servings: 3,
    cookTime: '1:45',
    instructions: '1. Clean the chicken and cut into medium sized pieces\n2.Coat the chicken in the spice mix\n3.Deep fry the chicken',
    ingredients:[
      {
        id:1,
        name:'Chicken',
        amount:'2 Pounds'
      },
      {
        id:2,
        name:'Spice mix',
        amount:'1 Cup'
      }
    ]
  },
  {
    id:2,
    name:'Paneer Masala',
    servings: 5,
    cookTime: '0:45',
    instructions: '1. Lightly fry paneer\n2.Prepare the gravy by mixing the masala mix and tomato paste\n3.Cook gravy for 5 mins, Add paneer and cook for another 5 mins',
    ingredients:[
      {
        id:1,
        name:'Paneer',
        amount:'3 Pounds'
      },
      {
        id:2,
        name:'Tomato paste',
        amount:'1 Cup'
      },
      {
        id:3,
        name:'Masala mix',
        amount:'2 Tbs'
      }
    ]
  }
]

export default App;
