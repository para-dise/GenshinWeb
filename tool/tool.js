const got = require('got');
const fs = require('fs');

const bannerName = "Ballad in Goblets".replaceAll(" ", "_").replaceAll("'", "_").toLowerCase();

const charactersToGet = {
    "tier5": ["Venti", "Keqing", "Mona", "Qiqi", "Diluc", "Jean"],
    "tier4": ["Fischl", "Xiangling", "Barbara", "Sucrose", "Chongyun", "Noelle", "Bennett", "Ningguang", "Xingqiu", "Beidou", "Razor"]
}

const weaponsToGet = {
    "tier5": [],
    "tier4": ["Sacrificial Bow", "The Stringless", "Favonius Warbow", "Eye Of Perception", "Sacrificial Fragments", "The Widsith", "Favonius Codex", "Favonius Lance", "Dragon's Bane", "Rainslasher", "Sacrificial Greatsword", "The Bell", "Favonius Greatsword", "Lion's Roar", "Sacrificial Sword", "The Flute", "Favonius Sword"],
    "tier3": ["Slingshot", "Sharpshooter's Oath", "Raven Bow", "Emerald Orb", "Thrilling Tales Of Dragon Slayers", "Magic Guide", "Black Tassel", "Debate Club", "Bloodtainted Greatsword", "Ferrous Shadow", "Skyrider Sword", "Harbinger Of Dawn", "Cool Steel"]
}

const chances = {
    "tier5": 0.600,
    "tier4": 5.100,
    "tier3": 94.300
}

let outputJSON = {};

const genJSONObject = (data, type) => {
    if(type == "character") {
        return {
            "name": data.name.toLowerCase().replace(" ", "_"),
            "type": "character",
            "displayname": data.name,
            "stars": data.rarity,
            "element": data.vision.toLowerCase(),
            "image": `https://api.genshin.dev/characters/${data.name.toLowerCase().replace(" ", "_")}/portrait`
        }
    } else {
        return {
            "name": data.name.toLowerCase().replace(" ", "_"),
            "type": "weapon",
            "displayname": data.name,
            "stars": data.rarity,
            "element": data.type.toLowerCase(),
            "image": `https://api.genshin.dev/weapons/${data.name.toLowerCase().replaceAll(" ", "-").replaceAll("'", "-")}/icon` // sigh
        }
    }
}

async function getCharacter(name) {
    console.log("Trying", name);
    const response = await got(`https://api.genshin.dev/characters/${name}`);
	return genJSONObject(JSON.parse(response.body), "character");
}

async function getWeapon(name) {
    console.log("Trying", name.replaceAll(" ", "-").replaceAll("'", "-").toLowerCase());
    const response = await got(`https://api.genshin.dev/weapons/${name.replaceAll(" ", "-").replaceAll("'", "-").toLowerCase()}`);
	return genJSONObject(JSON.parse(response.body), "weapon");
}

async function fetchCharacters() {
    let tier5s = [];
    let tier4s = [];
    let tier3s = [];
    for(let character of charactersToGet.tier5) {
        tier5s.push(await getCharacter(character));
    }
    for(let character of charactersToGet.tier4) {
        tier4s.push(await getCharacter(character));
    }

    for(let weapon of weaponsToGet.tier5) {
        tier5s.push(await getWeapon(weapon));
    }

    for(let weapon of weaponsToGet.tier4) {
        tier4s.push(await getWeapon(weapon));
    }

    for(let weapon of weaponsToGet.tier3) {
        tier3s.push(await getWeapon(weapon));
    }

    outputJSON.tier5 = tier5s;
    outputJSON.tier4 = tier4s;
    outputJSON.tier3 = tier3s;
    outputJSON.chances = chances
    fs.writeFileSync(`${bannerName}.json`, JSON.stringify(outputJSON));
}

fetchCharacters();
