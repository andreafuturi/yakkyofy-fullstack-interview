<script setup lang="ts">
const url = ref('')

/**
 * 📸 Test screenshot API
 */
const testApi = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/screenshot-request', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: url.value })
    })
    
    const data = await response.json()
    console.log('🎯 API Response:', data)
    
  } catch (e) {
    console.error('❌ Error:', e)
  }
}
</script>

<template>
  <div>
    <input v-model="url" type="text" placeholder="Enter URL">
    <button @click="testApi">Test API</button>
  </div>
</template>