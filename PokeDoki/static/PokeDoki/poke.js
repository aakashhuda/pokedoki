document.addEventListener('DOMContentLoaded', function(){
    
    const indexPg = document.querySelector("#index-pg");
    const all_poke = document.querySelector("#all-pokemons");
    const pgHeader = document.querySelector(".pg-header");
    const pgParagraph = document.querySelector(".pg-paragraph");
    const cards = document.querySelector(".cards");
    const pokeDiv = document.querySelector("#poke-div");
    //load index page
    indexPg.onclick = ()=>{
        pokeDiv.innerHTML = '';
    };
    //Showing All Pokemon
    all_poke.onclick = ()=>{
        showAll(cards,pgHeader,pgParagraph);
        return false;
    } 
})

//functions

//Showing All Pokemon function
function showAll(cards,pgHeader,pgParagraph){
    fetch("/all_pokemons")
    .then(response =>{
        return response.json()
    })
    .then(data =>{
        //data is recieved as a dict having 'data' as the key. Accessing the key 'data' provides us with all
        //information as one String. We'll convert the string to JSON using JSON.PARSE
        var finalData = JSON.parse(data.data)

        //pokemon object where all the fetched information will be stored.

        pgHeader.innerHTML = "All Pokemons";
        pgParagraph.innerHTML = ' ';
        for(var i = 0; i < 800; i++) {
            //fetching poke picture finalData["Name"][i]
            var name = finalData["Name"][i].toLowerCase();
            //function for fetching image

            var img = pokeImage(name);
            //creating new elements in the DOM
            var div = document.createElement("div")
            div.setAttribute("class","card")
            div.innerHTML =
            `<div class="con">
                <img src="${img}" alt="Avatar" style="width:100%">
                <h4><b>${finalData["Name"][i]}</b></h4>
                <p>${finalData["Type 1"][i]}</p>
            </div>`;
            cards.append(div);
        };
    })
    .catch(error=>{
        console.log("problem with django")
    });
}

function pokeImage(name){
    return (fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then(function(res) {
        if (res.ok){
            console.log("oneok")
            return res.json();
        }
        else{
            console.log("notok")
        } 
    })
    .then(function(dataa){
        return (dataa["sprites"].front_default)
    })
    .catch(function(errorr){
        console.log("problem from image api")
    }));
}

//index load function

/*function loadIndex(pokeDiv){
    fetch("/")
    .then(()=>{
        pokeDiv.innerHTML = '';
    })
    .catch(error=>{
        console.log(error)
    })
}*/