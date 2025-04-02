import api from './api'

export default {
    getAll() {
        return api.get('/books/get/books')
    },
    get(id) {
        return api.get(`/books/get/book/${id}`)
    },
    create(book) {
        return api.post('/books/add/book', book)
    },
    update(id, book) {
        return api.put(`/books/update/book/${id}`, book)
    },
    delete(id) {
        return api.delete(`/books/delete/book/${id}`)
    }
}
