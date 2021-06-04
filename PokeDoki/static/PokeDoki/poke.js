document.addEventListener('DOMContentLoaded', function(){
    
    const indexPg = document.querySelector("#index-pg");
    const all_poke = document.querySelector("#all-pokemons");
    const pgHeader = document.querySelector(".pg-header");
    const pgParagraph = document.querySelector(".pg-paragraph");
    const cards = document.querySelector(".cards");
    const pokeDiv = document.querySelector("#poke-div");
    const pokeInfo = document.querySelector(".poke-info");


    //load index page
    indexPg.onclick = ()=>{
        pokeDiv.innerHTML = '';
    };
    //Showing All Pokemon
    all_poke.onclick = ()=>{
        
        showAll(cards,pgHeader,pgParagraph,pokeInfo);
        return false;
    }
     
})

//functions

//Showing All Pokemon function
function showAll(cards,pgHeader,pgParagraph,pokeInfo){
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
        for(let i = 0; i < 800; i++) {

            //fetching poke picture
            let name = finalData["Name"][i].toLowerCase();
            
            //fetching image from api
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            .then((res)=>{
                return res.json()
            })
            .then((dt)=>{
                //gets the image link from the api
                var img = dt["sprites"].front_default
                //creating new elements in the DOM
                var div = document.createElement("div")
                //setting class name card for the div
                div.setAttribute("class","card")
                //setting data value for each div
                div.setAttribute("data-name" ,`${finalData["Name"][i]}`)
                div.innerHTML =
                `<div class="con">
                    <img src="${img}" alt="Avatar" style="width:100%">
                    <h4><b>${finalData["Name"][i]}</b></h4>
                    <p>${finalData["Type 1"][i]}</p>
                    <p>${finalData["Type 2"][i]}<p>
                </div>`;

                //inserting each new div inside the cards div
                cards.append(div);
                
            })
            .then(()=>{
                document.querySelectorAll(".card").forEach(function(card){
                    card.onclick = function() {
                        fetch(`/${card.dataset.name}/info`)
                        .then((res)=>{
                            return res.json()
                        })
                        .then(dt=>{
                            return JSON.parse(dt.pokemon)
                        })
                        .then(function(info){
                            return fetch(`https://pokeapi.co/api/v2/pokemon/${info["Name"].toLowerCase()}`)
                            .then((res)=>{
                                return res.json()
                            })    
                            .then(data=> {
                                return data = {
                                    img_info: data,
                                    info: info
                                }
                            })
                            
                            
                        })
                        .then((fullInfo)=>{
                            console.log(fullInfo["img_info"]["sprites"]["other"]["official-artwork"].front_default)
                            var divOne = document.createElement("div")
                            var divTwo = document.createElement("div")
                            var divThree = document.createElement("div")
                            divOne.className = "picture"
                            divTwo.className = "inf"
                            divThree.className = "chart"
                            divOne.innerHTML = `<div><img src="${fullInfo["img_info"]["sprites"]["other"]["official-artwork"].front_default}" alt="Official Artwork of ${fullInfo["info"]["Name"]}" width="80%"></div>`
                            divTwo.innerHTML = `<div>
                                                    <div>
                                                        Name: ${fullInfo["info"]["Name"]}
                                                    </div>
                                                    <div>
                                                        Type 1: ${fullInfo["info"]["Type 1"]}
                                                    </div>
                                                    <div>
                                                        Type 2: ${fullInfo["info"]["Type 2"]}
                                                    </div
                                                    <div>
                                                        Generation: ${fullInfo["info"]["Generation"]}
                                                    </div>
                                                    <div>
                                                        Legendary : ${fullInfo["info"]["Legendary"]}
                                                    </div>
                                                </div>`
                            
                            pokeInfo.append(divOne)
                            pokeInfo.append(divTwo)
                        })
                        .catch(error=>{
                            console.log(error)
                        })
                        
                    }
                })
            })
            .catch((error)=>{
                console.log(`problem with image api: ${error}`)
            })
        }
        
    })
    .catch(error=>{
        console.log("problem with django")
    });
}