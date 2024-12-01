<script setup lang="ts">
import { ref } from 'vue'
import { useScreenshotCapturer } from './composables/useScreenshotCapturer'

//url input value reference
const urlInput = ref('')

//initialize screenshotCapturer
const { capture, cancel, screenshot } = useScreenshotCapturer()


// Checks if the screenshot is currently being processed
const isProcessing = () => ['sending', 'queued', 'processing'].includes(screenshot.status)

// Gets the user-friendly status message based on current state
const statusMessage = () => {
  switch (screenshot.status) {
    case 'sending': return '📤 Sending request...'
    case 'queued': return '⏳ Waiting in queue...'
    case 'processing': return '🔄 Processing screenshot...'
    default: return null
  }
}
</script>

<template>
  <main class="p-4 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">📸 Website Screenshotter</h1>
    
    <!-- Form Section -->
    <form 
      @submit.prevent="() => capture(urlInput)" 
      :class="{ 'opacity-50': isProcessing() }"
      class="space-y-4"
      aria-label="Screenshot capture form"
    >
      <div class="space-y-2">
        <label for="url-input" class="block font-medium">Website URL</label>
        <input 
          id="url-input"
          v-model="urlInput" 
          type="url" 
          placeholder="Enter website URL" 
          class="w-full p-2 border-gray-300 rounded !border-solid border"
          :disabled="isProcessing()"
          :aria-busy="isProcessing()"
          required
        >
      </div>
      <button 
        type="submit"
        :disabled="!urlInput || isProcessing()"
        class="px-4 py-2 bg-blue-500 !text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Capture screenshot"
      >
        {{ !urlInput ? '📝 Enter URL to continue' : 'Take Screenshot' }}
      </button>
    </form>

    <!-- Status Section -->
    <section 
      v-if="isProcessing()" 
      class="flex items-center justify-center gap-4 py-4"
      role="status"
      aria-live="polite"
    >
      <div class="flex items-center gap-2">
        <p class="text-center">{{ statusMessage() }}</p>
      </div>
      <button 
        @click="cancel" 
        class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
      >
        Cancel
      </button>
    </section>
    
    <!-- Screenshot Result -->
    <section 
      v-if="screenshot.file" 
      class="space-y-4 mt-4"
      aria-label="Screenshot result"
    >
      <img 
        :src="screenshot.file" 
        alt="Website screenshot" 
        class="w-full rounded shadow-lg"
      >
    </section>
    <p 
      v-if="screenshot.error" 
      class="mt-8 text-red-700"
      role="alert"
      aria-live="assertive"
    >
      ❌ {{ screenshot.error }}
    </p>
  </main>
</template>
