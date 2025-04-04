<template>
    <div class="author-form">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>{{ isEditing ? 'Edit author' : 'Add author' }}</h1>
        <router-link to="/authors" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Back
        </router-link>
      </div>
      
      <LoadingSpinner v-if="loading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="loadAuthor" />
      
      <div v-else class="card">
        <div class="card-body">
          <form @submit.prevent="saveAuthor" novalidate>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="name" class="form-label">Name *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="form.name"
                  :class="{ 'is-invalid': submitted && !form.name }"
                  required
                >
                <div class="invalid-feedback">Name is obligatory</div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="$router.push('/authors')">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isSaving">
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {{ isEditing ? 'Save changes' : 'Add author' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
  
<script>
import authorsService from '@/services/authorsService'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
  
  export default {
    name: 'AuthorForm',
    components: {
      LoadingSpinner,
      ErrorMessage
    },
    props: {
      id: {
        type: Number,
        required: false,
        default: null
      }
    },
    data() {
      return {
        form: {
          name: ''
        },
        loading: false,
        error: null,
        submitted: false,
        isSaving: false,
        dateError: ''
      }
    },
    computed: {
      isEditing() {
        return this.id !== null
      }
    },
    mounted() {
      if (this.isEditing) {
        this.loadAuthor()
      }
    },
    methods: {
      loadAuthor() {
        this.loading = true
        this.error = null
        
        authorsService.get(this.id)
          .then(response => {
            const author = response.data
            
            this.form = {
              ...author,
            }
            
            this.loading = false
          })
          .catch(error => {
            console.error('Error loading author:', error)
            this.error = "Couldn't load author's data. Try again later."
            this.loading = false
          })
      },
      validateForm() {
        this.submitted = true
        this.dateError = ''
        
        if (!this.form.name) {
          return false
        }
        
        return true
      },
      saveAuthor() {
        if (!this.validateForm()) {
          return
        }
        
        this.isSaving = true
        
        const authorData = { ...this.form }
        
        const savePromise = this.isEditing
          ? authorsService.update(this.id, authorData)
          : authorsService.create(authorData)
        
        savePromise
          .then(() => {
            this.$router.push('/authors')
          })
          .catch(error => {
            console.error('Error saving author:', error)
            alert("Couldn't save author's data. Try again later.")
          })
          .finally(() => {
            this.isSaving = false
          })
      },
    }
  }
</script>
