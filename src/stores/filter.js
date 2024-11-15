import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', () => {
    const filterGroups = ref([
        { name: 'players', label: 'Players', values: [1, 2, 3, 4, 5, 6, 7, 8, 9], activeValues: [] },
        { name: 'playingTime', label: 'Playing Time', values: [], activeValues: [] },
        { name: 'yearPublished', label: 'Year Published', values: [], activeValues: [] },
    ])

    function applyFilter(_filter, value) {
        _filter = filterGroups.value.find(f => f.name === _filter)
        
        if (_filter.activeValues.includes(value)) {
            _filter.activeValues = _filter.activeValues.filter(v => v !== value)
        } else {
            _filter.activeValues.push(value)
        }
    }

    return { filterGroups, applyFilter }
})
