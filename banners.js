console.log("Loaded");

const bannerManager = async (banner) => {
  switch(banner) {
    case "Ballad in Goblets":
      return new Promise(function(resolve, reject) {
        $.getJSON( "banners/ballad_in_goblets.json", function( data ) { resolve(data) });
      });
    default:
      return new Promise(function(resolve, reject) {
        $.getJSON( "banners/ballad_in_goblets.json", function( data ) { resolve(data) });
      });
  }
}

async function getItems(banner="Ballad in Goblets") {
  const bannerItems = await bannerManager(banner);
  const itemList = [];

  for(let i = 0; i < 10; i++) {
    const items = chance.weighted([bannerItems.tier5, bannerItems.tier4, bannerItems.tier3], [bannerItems.chances.tier5, bannerItems.chances.tier4, bannerItems.chances.tier3]);
    itemList.push(items[Math.floor(Math.random() * items.length)]);
  }
  return itemList;
}
