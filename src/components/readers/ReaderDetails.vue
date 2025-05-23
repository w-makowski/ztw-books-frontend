<template>
    <div class="author-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Reader Details</h1>
        <div>
          <router-link :to="`/readers/edit/${id}`" class="btn btn-warning">
            <i class="bi bi-pencil"></i> Edit
          </router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadReader" />
      
      <div v-else-if="reader" class="row">
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <i class="bi bi-person-circle" style="font-size: 5rem;"></i>
              </div>
              <h2 class="card-title">{{ reader.name }}</h2>
            </div>
          </div>
        </div>
        
        <div class="col-12">
           <div class="card">
             <div class="card-header d-flex justify-content-between align-items-center">
               <h5 class="mb-0">Reader's rentals</h5>
               <span class="badge bg-info">{{ readerRentals ? readerRentals.length : 0 }} rentals</span>
             </div>
             <div class="card-body">
               <div v-if="!readerRentals || readerRentals.length === 0" class="text-center py-4">
                 <p class="mb-0">This reader doesn't have any rentals in our library</p>
               </div>
               <div v-else class="table-responsive">
                 <table class="table table-striped table-hover">
                   <thead>
                     <tr>
                       <th>ID</th>
                       <th>Book</th>
                       <th>Rental Date</th>
                       <th>Return Date</th>
                       <th>Status</th>
                       <th>Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr v-for="rental in readerRentals" :key="rental.id">
                       <td>{{ rental.id }}</td>
                       <td>{{ getBookTitle(rental.bookId) }}</td>
                       <td>{{ formatDate(rental.rentalDate) }}</td>
                       <td>{{ rental.returnDate ? formatDate(rental.returnDate) : 'Not returned' }}</td>
                       <td>
                         <span :class="getStatusBadgeClass(rental)">
                           {{ rental.returnDate ? 'Returned' : 'Rented' }}
                         </span>
                       </td>
                       <td>
                         <router-link :to="`/rentals/${rental.id}`" class="btn btn-sm btn-info">
                           <i class="bi bi-eye"></i> details
                         </router-link>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div v-else class="alert alert-warning">
        Nie znaleziono czytelnika o podanym ID
      </div>
    </div>
</template>
  
<script>
import readersService from '@/services/readersService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import booksService from "@/services/booksService.js";
  
  export default {
    name: 'ReaderDetails',
    components: {
      LoadingSpinner,
      ErrorMessage
    },
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        reader: null,
        loading: true,
        error: null,
        readerRentals: [],
        books: {}
      }
    },
    mounted() {
      this.loadReaderRentals()
      this.loadReader()
    },
    methods: {
      loadReaderRentals(){
        this.loading = true
        this.error  = null

        readersService.getRentals(this.id)
          .then(response => {
            this.readerRentals = response.data
            this.loadBookTitles()
          })
          .catch(error => {
            console.error('Error loading reader rentals:', error)
            this.error = 'Nie udało się załadować wypożyczeń czytelnika. Spróbuj ponownie później.'
          })
            .finally(() => {
              this.loading = false
            })
      },
      loadBookTitles() {
        const bookIds = [...new Set(this.readerRentals.map(rental => rental.bookId))]

        bookIds.forEach(bookId => {
          if (!this.books[bookId]) {
            this.books[bookId] = 'Loading...'

            booksService.get(bookId)
                .then(response => {
                  this.books[bookId] = response.data.title
                })
                .catch(error => {
                  console.error(`Error loading book ${bookId}:`, error)
                  this.books[bookId] = 'Unknown book'
                })
          }
        })
      },
      getBookTitle(bookId) {
        return this.books[bookId] || 'Loading...'
      },
      loadReader() {
        this.loading = true
        this.error = null
        
        readersService.get(this.id)
          .then(response => {
            this.reader = response.data
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading readers details:', error)
            this.error = 'Nie udało się załadować szczegółów czytelnika. Spróbuj ponownie później.'
            this.loading = false
          })
      },
      formatDate(dateString) {
        if (!dateString) return 'Brak danych'
        return new Date(dateString).toLocaleDateString('pl-PL')
      },
      getStatusBadgeClass(rental) {
        return rental.returnDate ? 'badge bg-success' : 'badge bg-warning'
      }
    }
  }
</script>
