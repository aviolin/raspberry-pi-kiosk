<script setup>
import { RouterLink } from 'vue-router';

import StarRating from '@/components/StarRating.vue';
import NumPlayers from '@/components/NumPlayers.vue';
import PlayTime from '@/components/PlayTime.vue';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();

import collection from '../../collection.js';

const game = ref({});

async function getBoardGameCollection(username) {
  const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}`;

  try {
    // Fetch the XML data
    const response = await fetch(url);
    const xmlData = await response.text();

    // Parse XML to JSON
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    // Convert XML to JSON
    const json = xmlToJson(xmlDoc);

        // Transform JSON to simplified collection format
    const formattedCollection = json.items.item.map(item => {
      return {
        name: item.name ? item.name["#text"] : "Unknown",
        description: item.description ? item.description["#text"] : "No description available",
        yearPublished: item.yearpublished ? item.yearpublished["#text"] : "Unknown",
        minPlayers: item.minplayers ? parseInt(item.minplayers["#text"], 10) : "Unknown",
        maxPlayers: item.maxplayers ? parseInt(item.maxplayers["#text"], 10) : "Unknown",
        playingTime: item.playingtime ? parseInt(item.playingtime["#text"], 10) : "Unknown",
        image: item.image ? item.image["#text"] : null,
        thumbnail: item.thumbnail ? item.thumbnail["#text"] : null,
      };
    });

    console.log(formattedCollection);
    return json;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

async function getBoardGameThing(id) {
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`;

  try {
    // Fetch the XML data
    const response = await fetch(url);
    const xmlData = await response.text();

    // Parse XML to JSON
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    // Convert XML to JSON
    const json = xmlToJson(xmlDoc)?.items?.item;

    const formattedThing = {
        name: json.name ? json.name[0]['@attributes'].value : "Unknown",
        description: json.description ? json.description['#text'] : "No description available",
        image: json.image ? json.image['#text'] : null,
        minPlayers: json.minplayers ? parseInt(json.minplayers['@attributes'].value) : "Unknown",
        maxPlayers: json.maxplayers ? parseInt(json.maxplayers['@attributes'].value) : "Unknown",
        minPlaytime: json.minplaytime ? parseInt(json.minplaytime['@attributes'].value) : "Unknown",
        maxPlaytime: json.maxplaytime ? parseInt(json.maxplaytime['@attributes'].value) : "Unknown",
        playingTime: json.playingtime ? parseInt(json.playingtime['@attributes'].value) : "Unknown",
        yearPublished: json.yearpublished ? parseInt(json.yearpublished['@attributes'].value) : "Unknown",
    }

    game.value = formattedThing;

    console.log(formattedThing);
    return formattedThing;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

// Helper function to convert XML to JSON
function xmlToJson(xml) {
  let obj = {};
  if (xml.nodeType === 1) { // element node
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text node
    obj = xml.nodeValue;
  }

  // Process child nodes
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

const bggToCleanJson = (json) => {

}

onMounted(() => {

    getBoardGameThing(route.params.id);


    //https://boardgamegeek.com/xmlapi2/thing?id=68448&stats=1
//   fetch('	https://bgg-json.azurewebsites.net/collection/aviolin',
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/xml'
//       }
//     })
//     .then(response => response.text())
//     .then(data => console.log(data))
//     .catch(error => console.error(error))
})

</script>

<template>
    <section class="container">
        <div class="row row-content">
            <div class="image-holder">
                <img :src="game.image" :alt="game.name" />
            </div>
            <div class="content-holder">
                <RouterLink to="/" class="breadcrumb">Back</RouterLink>
                <h1>{{ game.name }}</h1>
                <StarRating :rating="game.averageRating" />
                <NumPlayers :min="game.minPlayers" :max="game.maxPlayers" />
                <PlayTime :time="game.playingTime" />
                <p>{{ game.description }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
h1 {
    margin-block: 1rem;
}
.container {
    min-height: 100vh;
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.row {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
}
.row-content {
    height: 100%;
}
.image-holder {
    position: sticky;
    top: 2rem;
    width: 50%;
    height: calc(100vh - 4rem);
    background: #fff1;
    flex: 1;
    padding: 1rem;
}
.image-holder img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.content-holder {
    flex: 1;
    padding-right: 6rem;
}
.breadcrumb {
    color: var(--color-primary);
    text-decoration: none;
    font-size: 1.5rem;
    background: #fff1;
    padding: 1rem;
    display:inline-block;
    position: absolute;
    top: 2rem;
    right: 2rem;
}
</style>