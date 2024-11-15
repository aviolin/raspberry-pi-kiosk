import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import xmlToJson from '@/xmlToJson'

function transformPollData(pollData) {
  return {
      polls: pollData.map(poll => ({
          name: poll["@attributes"].name,
          title: poll["@attributes"].title,
          totalVotes: parseInt(poll["@attributes"].totalvotes, 10),
          results: Array.isArray(poll.results) ? 
              poll.results.map(result => {
                  switch (poll["@attributes"].name) {
                      case "suggested_numplayers":
                          return {
                              numPlayers: result["@attributes"].numplayers,
                              votes: Object.fromEntries(
                                  result.result.map(r => [r["@attributes"].value, parseInt(r["@attributes"].numvotes, 10)])
                              )
                          };
                      
                      case "suggested_playerage":
                          return result.result.map(r => ({
                              age: r["@attributes"].value,
                              numVotes: parseInt(r["@attributes"].numvotes, 10)
                          }));
                      
                      case "language_dependence":
                          return result.result.map(r => ({
                              level: parseInt(r["@attributes"].level, 10),
                              description: r["@attributes"].value,
                              numVotes: parseInt(r["@attributes"].numvotes, 10)
                          }));
                      
                      default:
                          return result;
                  }
              }).flat() : 
              poll.results.result.map(r => ({ // Handles cases where `poll.results` is not an array
                  age: r["@attributes"].value || null,
                  numVotes: parseInt(r["@attributes"].numvotes, 10)
              }))
      }))
  };
}

async function getBoardGameCollection(username) {
  const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1`;

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
        id: item["@attributes"].objectid,
        name: item.name ? item.name["#text"] : "Unknown",
        description: item.description ? item.description["#text"] : "No description available",
        yearPublished: item.yearpublished ? item.yearpublished["#text"] : "Unknown",
        minPlayers: item.stats['@attributes'].minplayers ? parseInt(item.stats['@attributes'].minplayers, 10) : "Unknown",
        maxPlayers: item.stats['@attributes'].maxplayers ? parseInt(item.stats['@attributes'].maxplayers, 10) : "Unknown",
        playingTime: item.stats['@attributes'].playingtime ? parseInt(item.stats['@attributes'].playingtime, 10) : "Unknown",
        image: item.image ? item.image["#text"] : null,
        thumbnail: item.thumbnail ? item.thumbnail["#text"] : null,
        averageRating: item.stats.rating.average["@attributes"].value ? parseFloat(item.stats.rating.average["@attributes"].value) : "Unknown",
      };
    });

    return formattedCollection;
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
        polls: transformPollData(json.poll)
    }

    return formattedThing;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

export const useGamesStore = defineStore('games', () => {
  const collection = ref([])

  const collectionSets = computed(() => {
    const sets = []
    for (let i = 0; i < collection.value.length; i+=4) {
      const set = [
        collection.value[i],
        collection.value[i + 1],
        collection.value[i + 2],
        collection.value[i + 3],
      ]
      sets.push(set)
    }
    return sets
  })

  async function addItemDetails(id) {
    const itemIndex = collection.value.findIndex(item => item.id === id);
    if (!itemIndex || collection.value[itemIndex].hasDetails) return;

    const details = await getBoardGameThing(id);
    collection.value[itemIndex] = { ...collection.value[itemIndex], ...details, hasDetails: true };
  }

  async function updateCollection(usernames) {
    collection.value = []
    for (const username of usernames) {
      const coll = await getBoardGameCollection(username);
      collection.value = collection.value.concat(coll);
    }
    
    // filter collection to not have any duplicate games based on id
    const uniqueCollection = collection.value.filter((game, index, self) =>
      index === self.findIndex((t) => (
        t.id === game.id
      ))
    )
    // sort board games by their name alphabetically
    uniqueCollection.sort((a, b) => a.name.localeCompare(b.name));

    collection.value = uniqueCollection
  }

  return { collection, updateCollection, collectionSets, addItemDetails }
})
