
// Manages a list of favorite items using localStorage
export class FavoritesManager {

    // localStorage management 
    constructor(storageKey = 'favorites') {
        this.storageKey = storageKey
        this.favorites = this.load()
    }

    load() {
        const storedFavorites = localStorage.getItem(this.storageKey)
        return storedFavorites ? JSON.parse(storedFavorites) : []
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.favorites))
    }

    // methodes
    add(id) {
        if (!this.has(id)) {
            this.favorites.push(id)
            this.save()
            return true
        }
        
        return false
    }

    remove(id) {
        const index = this.favorites.indexOf(id)
        if (index !== -1) {
            this.favorites.splice(index, 1)
            this.save()
            return true
        }
        return false
    }

    has(id) {
        return this.favorites.includes(id)
    }

    toggle(id) {
        return this.has(id) ? this.remove(id) : this.add(id) // has + remove OU add
    }

    getAll() {
        return [...this.favorites]
    }

    count () {
        return this.favorites.length
    }
}