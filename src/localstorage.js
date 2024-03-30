import { writable } from 'svelte/store'

export const localStore = (key, initial = undefined) => {
	
	const toString = (value) => JSON.stringify(value, null, 2)
	const toObj = JSON.parse
	
	let storageItem = localStorage.getItem(key)
	if (storageItem === null || storageItem === undefined) {
		if (initial !== undefined) {
			localStorage.setItem(key, toString(initial))
		}
	}
	
	const saved = storageItem != 'undefined' ? toObj(storageItem) : initial
	
	const { subscribe, set, update } = writable(saved)
	
	return {
		subscribe,
		set: (value) => {
			localStorage.setItem(key, toString(value))
			
			if (!value) {
				localStorage.removeItem(key)
			}
			
			return set(value)
		},
		update
	}
}