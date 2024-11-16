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
  const url = `https://boardgamegeek.com/xmlapi2/collection?username=${username}&stats=1&excludesubtype=boardgameexpansion`;

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
        type: item["@attributes"].subtype === "boardgame" ? 1 : 2,
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

async function getBoardGameThings(ids) {
  const idsString = Array.isArray(ids) ? ids.join(",") : ids;
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${idsString}`;

  try {
    // Fetch the XML data
    const response = await fetch(url);
    const xmlData = await response.text();

    // Parse XML to JSON
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");

    // Convert XML to JSON
    const json = xmlToJson(xmlDoc)?.items;

    if (!Array.isArray(json.item)) {
      json.item = [json.item];
    }

    const formattedThings = json.item.map(item => {
      return {
          id: item["@attributes"].id,
          name: item.name[0] ? item.name[0]['@attributes'].value : item.name ? item.name['@attributes'].value : "Unknown",
          description: item.description ? item.description['#text'] : "No description available",
          image: item.image ? item.image['#text'] : null,
          minPlayers: item.minplayers ? parseInt(item.minplayers['@attributes'].value) : "Unknown",
          maxPlayers: item.maxplayers ? parseInt(item.maxplayers['@attributes'].value) : "Unknown",
          minPlaytime: item.minplaytime ? parseInt(item.minplaytime['@attributes'].value) : "Unknown",
          maxPlaytime: item.maxplaytime ? parseInt(item.maxplaytime['@attributes'].value) : "Unknown",
          playingTime: item.playingtime ? parseInt(item.playingtime['@attributes'].value) : "Unknown",
          yearPublished: item.yearpublished ? parseInt(item.yearpublished['@attributes'].value) : "Unknown",
          polls: transformPollData(item.poll),
          categories: item.link.filter(link => link['@attributes'].type === 'boardgamecategory').map(link => link['@attributes'].value),
      }

    })

    return formattedThings;
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

export const useGamesStore = defineStore('games', () => {
  const collection = ref([])

  const filteredCollection = computed(() => {

    let _collection = collection.value

    filterGroups.value.forEach(filter => {
      if (filter.name === 'players') {
        _collection = _collection.filter(item => {
          const players = []
          for (let i = item.minPlayers; i <= item.maxPlayers; i++) {
            players.push(i)
          }
          return filter.activeValues.length === 0 || players.some(p => filter.activeValues.includes(p))
        })
      } else if (filter.name === 'type') {

        _collection = _collection.filter(item => {
          return filter.activeValues.length === 0 || filter.activeValues.includes(item.type)
        })
      }
    })

    return _collection
  })

  const collectionSets = computed(() => {

    let sets = []
    for (let i = 0; i < filteredCollection.value.length; i+=3) {
      const set = [
        filteredCollection.value[i],
        filteredCollection.value[i + 1],
        filteredCollection.value[i + 2],
      ]
      sets.push(set)
    }

    return sets
  })

  const collectionCategories = computed(() => {
    const categories = filteredCollection.value.reduce((acc, item) => {
      const itemCategories = Array.isArray(item.categories) ? item.categories : [item.categories];
      
      itemCategories.forEach(category => {
        if (!acc.some(c => c.name === category)) {
          acc.push({
            name: category,
            items: []
          });
        }
      });
      return acc;
    }, []);

    categories.push({
      name: 'Uncategorized',
      items: filteredCollection.value.filter(item => !item.categories || !item.categories.length)
    })
  
    filteredCollection.value.forEach(item => {
      const itemCategories = Array.isArray(item.categories) ? item.categories : [item.categories];
      
      itemCategories.forEach(category => {
        const cat = categories.find(c => c.name === category);
        cat.items.push(item);
      });
    });

    categories.sort((a, b) => {
      return a.name.localeCompare(b.name, 'ja')
    });
  
    return categories;
  });
  
  async function addItemDetails(ids) {

    const details = await getBoardGameThings(ids);

    if (Array.isArray(ids)) {
      ids.forEach(i => {
        const index = collection.value.findIndex(item => item.id === i);
        collection.value[index] = { ...collection.value[index], ...details.find(item => item.id === i), hasDetails: true };
      })
    } else {
      const itemIndex = collection.value.findIndex(item => item.id === ids);
      // if (!itemIndex || collection.value[itemIndex].hasDetails) return;
      collection.value[itemIndex] = { ...collection.value[itemIndex], ...details, hasDetails: true };
    }
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

  const filterGroups = ref([
    { name: 'players', label: 'Players', values: [1, 2, 3, 4, 5, 6, 7, 8, 9], activeValues: [] },
    // { name: 'type', label: 'Type', values: [1, 2], activeValues: [] },
    // { name: 'playingTime', label: 'Playing Time', values: [], activeValues: [] },
  ])

  function applyFilter(_filter, value) {
    _filter = filterGroups.value.find(f => f.name === _filter)
    value = +value;
    
    if (_filter.activeValues.includes(value)) {
        _filter.activeValues = _filter.activeValues.filter(v => v !== value)
    } else {
        _filter.activeValues.push(value)
    }
  }

  return { collection, filteredCollection, collectionCategories, updateCollection, collectionSets, addItemDetails, filterGroups, applyFilter }
})
