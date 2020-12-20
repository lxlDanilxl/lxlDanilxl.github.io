"use strict";
function nav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
	x.className += " responsive";
  } else {
	x.className = "topnav";
  }
}


const pokedex = document.getElementById('pokedex');

const fetchPokemon = () => {
	var url = `https://pokeapi.co/api/v2/pokemon`;
	var counts = fetch(url).then((res) => res.json()).catch(function() {
        	pokedex.innerHTML = "<h1> API ERROR </h1>";
    	});

	Promise.all([counts]).then((count) => {
		var total = 0;
		total = count[0].count;
		const promises = [];
		const url2 = `https://pokeapi.co/api/v2/pokemon?limit=`+total;
		promises.push(fetch(url2).then((res) => res.json()).catch(function() {
        	pokedex.innerHTML = "<h1> API ERROR </h1>";
    	}));
		Promise.all(promises).then((results) => {
			var res = results[0]['results'];
			const promises2 = [];
			var aux = 0;
			while(aux<total) {
				for (var i = aux; i < aux+100 && i<total; i++) {
					console.log(res[i].url)
					promises2.push(fetch(res[i].url).then((res) => res.json()));
				};
				Promise.all(promises2).then((results) => {
					var res = results.filter(function (val) {
						var ret = true;
						ret &= val.name != null;
						ret &= val.sprites['front_default'] != null;
						ret &= val.types.map((type) => type.type.name).join(', ') != null;
						ret &= val.id != null;
						return ret;
					});
					const pokemon = res.map((result) => ({
						name: result.name,
						image: result.sprites['front_default'],
						type: result.types.map((type) => type.type.name).join(', '),
						id: result.id
					}));
					displayPokemon(pokemon);
				});
				aux+=100;
			}     
		});
	});
};

function generation(gen) {
	var gendiv = document.getElementById('generations');
	var typediv = document.getElementById('types');
	typediv.hidden=true;
	if(gen == null) {
		if(gendiv.hidden) {
			var url = `https://pokeapi.co/api/v2/generation`;
			var gens = [];
			var generations = fetch(url).then((res) => res.json()).catch(function() {
	        	pokedex.innerHTML = "<h1> API ERROR </h1>";
	    	});
			//console.log(generations);
			Promise.all([generations]).then((results) => {
				gens = results[0].results;  
				gendiv.innerHTML="";
				for (var i = 0; i < gens.length; i++) {
					var name = gens[i].name.toUpperCase().replace("GENERATION-", "  Generacion ");
					gendiv.innerHTML += '<a id="gen'+(i+1)+'" href="javascript:void(0);" onclick="generation('+ (i+1) +')">'+name+'</a>';
				}          
			});
		}
		gendiv.hidden = !gendiv.hidden;
	} else {
		var url = `https://pokeapi.co/api/v2/generation/`+gen;
		var data = fetch(url).then((res) => res.json()).catch(function() {
        	pokedex.innerHTML = "<h1> API ERROR </h1>";
    	});
		Promise.all([data]).then((results) => {
			gens = results[0].pokemon_species;
			const promises = [];
			var index = []
			for (var i = 0; i < gens.length; i++) {
				index.push(gens[i].url.split("pokemon-species/")[1].split("/")[0]);
			};
			index.sort(function(a, b){return a-b})
			for (var i = 0; i < index.length; i++) {
				const url = `https://pokeapi.co/api/v2/pokemon/`+index[i];
				promises.push(fetch(url).then((res) => res.json()).catch(function() {
		        	pokedex.innerHTML = "<h1> API ERROR </h1>";
		    	}));
			};
			Promise.all(promises).then((results) => {
				var res = results.filter(function (val) {
					var ret = true;
					ret &= val.name != null;
					ret &= val.sprites['front_default'] != null;
					ret &= val.types.map((type) => type.type.name).join(', ') != null;
					ret &= val.id != null;
					return ret;
				});
				const pokemon = res.map((result) => ({
					name: result.name,
					image: result.sprites['front_default'],
					type: result.types.map((type) => type.type.name).join(', '),
					id: result.id
				}));
				displayPokemon(pokemon);
			});          
		});
		//gendiv.hidden = true;
		typediv.hidden = true;
		var list = document.getElementsByClassName("active");
		for (let item of list) {
		    item.classList.remove("active");
		}
		document.getElementById("gen"+gen).classList.add("active");
		nav();
	};
};

function pType(type) {
	var gendiv = document.getElementById('generations');
	var typediv = document.getElementById('types');
	gendiv.hidden=true;
	if(type == null) {
		if(typediv.hidden) {
			var url = `https://pokeapi.co/api/v2/type`;
			var gens = [];
			var types = fetch(url).then((res) => res.json()).catch(function() {
	        	pokedex.innerHTML = "<h1> API ERROR </h1>";
	    	});
			console.log(types);
			Promise.all([types]).then((results) => {
				gens = results[0].results;  
				typediv.innerHTML="";
				for (var i = 0; i < gens.length; i++) {
					var url2 = gens[i].url;
					var typeInfo = fetch(url2).then((res) => res.json()).catch(function() {
			        	pokedex.innerHTML = "<h1> API ERROR </h1>";
			    	})
					Promise.all([typeInfo]).then((results) => {
						if (results[0].pokemon.length > 0) {
							var namesData = results[0].names;
							var name = "";
							for (var j = 0; j < namesData.length; j++) {
								if (namesData[j].language.name == "en" && name=="") {
									name = namesData[j].name;
								};
								if (namesData[j].language.name == "es") {
									name = namesData[j].name;
								};
							};
							typediv.innerHTML += '<a id="type'+results[0].id+'" href="javascript:void(0);" onclick="pType('+ results[0].id +')">'+name+'</a>';
						};
					});
				}          
			});
		}
		typediv.hidden = !typediv.hidden;
	} else {
		var url = `https://pokeapi.co/api/v2/type/`+type;
		var data = fetch(url).then((res) => res.json()).catch(function() {
        	pokedex.innerHTML = "<h1> API ERROR </h1>";
    	});
		Promise.all([data]).then((results) => {
			gens = results[0].pokemon;
			console.log(gens);
			const promises = [];
			var index = [];
			for (var i = 0; i < gens.length; i++) {
				index.push(gens[i].pokemon.url.split("pokemon/")[1].split("/")[0]);
			};
			index.sort(function(a, b){return a-b});
			for (var i = 0; i < index.length; i++) {
				const url = `https://pokeapi.co/api/v2/pokemon/`+index[i];
				promises.push(fetch(url).then((res) => res.json()).catch(function() {
		        	pokedex.innerHTML = "<h1> API ERROR </h1>";
		    	}));
			};
			Promise.all(promises).then((results) => {
				var res = results.filter(function (val) {
					var ret = true;
					ret &= val.name != null;
					ret &= val.sprites['front_default'] != null;
					ret &= val.types.map((type) => type.type.name).join(', ') != null;
					ret &= val.id != null;
					return ret;
				});
				const pokemon = res.map((result) => ({
					name: result.name,
					image: result.sprites['front_default'],
					type: result.types.map((type) => type.type.name).join(', '),
					id: result.id
				}));
				displayPokemon(pokemon);
			});          
		});
		//typediv.hidden = false;
		gendiv.hidden = true;
		
		var list = document.getElementsByClassName("active");
		for (let item of list) {
		    item.classList.remove("active");
		}
		document.getElementById("type"+type).classList.add("active");
		nav();
	};
};

const displayPokemon = (pokemon) => {
	//console.log(pokemon);
	const pokemonHTMLString = pokemon
		.map(
			(pokeman) => `
		<li class="card">
			<img class="card-image" src="${pokeman.image}"/>
			<h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
			<p class="card-subtitle">${pokeman.type}</p>
		</li>
	`
		)
		.join('');
	pokedex.innerHTML = pokemonHTMLString;
};

fetchPokemon();

