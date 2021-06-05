document.addEventListener('DOMContentLoaded', function(){
    
    const indexPg = document.querySelector("#index-pg");
    const all_poke = document.querySelector("#all-pokemons");
    const pgHeader = document.querySelector(".pg-header");
    const pgParagraph = document.querySelector(".pg-paragraph");
    const cards = document.querySelector(".cards");
    const pokeDiv = document.querySelector(".poke-div");
    const pokeInfo = document.querySelector(".poke-info");
    


    //load index page
    indexPg.onclick = ()=>{
        pokeDiv.innerHTML = '';
    };
    //Showing All Pokemon
    all_poke.onclick = ()=>{
        pokeInfo.innerHTML = '';
        showAll(cards,pgHeader,pgParagraph,pokeInfo,pokeDiv);
        return false;
    }
     
})

//functions

//Showing All Pokemon function
function showAll(cards,pgHeader,pgParagraph,pokeInfo,pokeDiv){
    console.log("Running")
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
                </div>`;

                //inserting each new div inside the cards div
                cards.append(div);
            //assigning onclick event to each card    
            })
            .then(()=>{
                document.querySelectorAll(".card").forEach(function(card){
                    card.onclick = function() {
                        //accessing the data-name information
                        fetch(`/${card.dataset.name}/info`)
                        .then((res)=>{
                            return res.json()
                        })
                        .then(dt=>{
                            //converting to Json
                            return JSON.parse(dt.pokemon)
                        })
                        //fetching for image
                        //returning a object with the image and csv informations(using object makes it async operation)
                        .then(function(info){
                            pgHeader.innerHTML = `${info["Name"]}`
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
                        //creating divs accessing the object's information
                        .then((fullInfo)=>{
                            
                            var divOne = document.createElement("div")
                            var divTwo = document.createElement("div")
                            divOne.className = "picture"
                            divTwo.className = "inf"
                            divOne.innerHTML = `<div><img src="${fullInfo["img_info"]["sprites"]["other"]["official-artwork"].front_default}" alt="Official Artwork of ${fullInfo["info"]["Name"]}" style='max-height: 100%; max-width: 100%; object-fit: cover'></div>`
                            divTwo.innerHTML = `<div>
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
                                                    </div>`
                            
                            pokeInfo.append(divOne)
                            pokeInfo.append(divTwo)
                            return fullInfo["info"]
                        })
                        .then((info)=>{
                            var divThree = document.createElement("div")
                            divThree.className = "chart"
                            divThree.innerHTML = `<canvas id="myChart" width="400" height="400"></canvas>`
                            pokeInfo.append(divThree)
                            return info
                        })
                        .then((info)=>{
                            console.log(info)
                            var ctx = document.querySelector("#myChart").getContext('2d')
                            var myChart = new Chart(ctx, {
                                type: "bar",
                                data : {
                                    labels: ["Attack","Defense","HP","Sp. Atk","Sp. Def","Speed"],
                                    datasets: [{
                                        label: `${info["Name"]}'s Statistics`,
                                        data: [info["Attack"],info["Defense"],info["HP"],info["Sp. Atk"],info["Sp. Def"],info["Speed"]],
                                        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                                        borderColor: ['#2F4858'],
                                        borderWidth: 1
                                    }]
                                }
                            })
                            console.log(pokeDiv)
                            cards.innerHTML= ''
                            
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