
const loadCategories = (catData) => {
  let catContainer = document.getElementById('catContainer');
  catData.forEach(element => {
    let col = document.createElement('div');
    col.setAttribute('class','col-10 col-md-3 pt-2');
    let card = document.createElement('div');
    card.setAttribute('class','card catcolor');
    card.setAttribute('onclick',`getCatMeals('${element.strCategory}')`);
    let cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body')
    let h5 = document.createElement('h5');
    h5.setAttribute('class','increasesize');
    h5.innerHTML = element.strCategory;
    cardBody.append(h5);
    card.append(cardBody);
    col.append(card);
    catContainer.append(col);
  });
}

const getCatMeals = async(selectedCat) => {
  try {
    let CatSelectedSection = document.getElementById('CatSelectedSection');
    CatSelectedSection.style.display = "block";
    let catMealsURI = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCat}`;
    const catMealResponse = await fetch(catMealsURI);
    const catMealJson = await catMealResponse.json();
    loadCatMeals(catMealJson.meals); 
  } catch (error) {
    window.alert(error);
  }
}

const loadCatMeals = (catMeals) => {
  let catMealsdiv = document.getElementById('catMeals');
  catMealsdiv.innerHTML = '';
  catMeals.forEach(element => {
    let col = document.createElement('div');
    col.setAttribute('class','col-10 col-md-3 pt-2 mt-3 mt-md-0');
    let card = document.createElement('div');
    card.setAttribute('class','card');
    // card.setAttribute('onclick',`getCatMeals('${element.strCategory}')`);
    let cardImg = document.createElement('img');
    cardImg.setAttribute('class','card-img-top');
    cardImg.src = element.strMealThumb;
    let cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body')
    let h5 = document.createElement('h6');
    h5.setAttribute('class','card-title');
    h5.innerHTML = element.strMeal;
    let button = document.createElement('button');
    button.setAttribute('class','btn btn-orange');
    button.setAttribute('onclick',`openDetails('${element.idMeal}')`);
    button.innerHTML = 'Details';

    cardBody.append(h5,button);
    card.append(cardImg,cardBody);
    col.append(card);
    catMealsdiv.append(col);
  })
}


const openDetails = async(MealID) => {
  try {
    const MealSearchUri = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${MealID}`;
    const eachMealData = await fetch(MealSearchUri) ;
    const MealJson = await eachMealData.json();
    loadDetailsScreen(MealJson.meals[0]);
  } catch (error) {
    window.alert(error);
  }
}

const loadDetailsScreen = (EachMealDetails) => {
    let MealIndSection = document.getElementById('MealIndSection');
    MealIndSection.style.display = "block";
    MealIndSection.scrollIntoView();
    const MealName = document.getElementById('MealName');
    MealName.innerHTML = EachMealDetails.strMeal;
    const subCat = document.getElementById('subCat');
    subCat.innerHTML = EachMealDetails.strCategory;
    const ingredeints = document.getElementById('ingredeints');
    const ul = document.createElement('ul');
    const Eachkeys = Object.keys(EachMealDetails);
    const regexInd = new RegExp('strIngredient');
    const filteredKeysInd = Eachkeys.filter(element => element.match(regexInd));

    filteredKeysInd.forEach(element => {
      if(EachMealDetails[element].length > 0){
        const li = document.createElement('li');
        li.innerHTML = EachMealDetails[element]
        ul.append(li);
      }
    })
    ingredeints.append(ul);
    const mealInst = document.getElementById('mealInst');
    mealInst.innerHTML = EachMealDetails.strInstructions;
}

const getCategories = async() => {
  try {
    let MealIndSection = document.getElementById('MealIndSection');
    MealIndSection.style.display = "none";
    let CatSelectedSection = document.getElementById('CatSelectedSection');
    CatSelectedSection.style.display = "none";
    const uri = 'https://www.themealdb.com/api/json/v1/1/list.php?c=';
    const response = await fetch(uri);
    const jsonData = await response.json();
    loadCategories(jsonData.meals);
  } catch (error) {
    window.alert(error);
  }
}

getCategories();


const getSearchedItem = async(searchedItem) => {
  try {
    const searchUri = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedItem}`;
    const searchResp = await fetch(searchUri);
    const searchJson = await searchResp.json();
    if(searchJson.meals === null){
      throw `Recipe for ${searchedItem} is not found!`
    }
    openDetails(searchJson.meals[0].idMeal);
  } catch (error) {
    window.alert(error);
  }
}

let search_btn = document.getElementById('search_btn');
search_btn.addEventListener('click', () => {
  let MealIndSection = document.getElementById('MealIndSection');
  MealIndSection.style.display = "none";
  let search_inp = document.getElementById('search_inp');
  let searchValue = search_inp.value;
  getSearchedItem(searchValue);
})