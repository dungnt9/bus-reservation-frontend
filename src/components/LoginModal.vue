// src/components/LoginModal.vue
<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <button class="close-button" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>
      <Login
        :popup-mode="true"
        @login-success="handleLoginSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Login from '@/views/Login.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close', 'login-success']);

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};

const handleLoginSuccess = () => {
  emit('login-success');
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  padding: 20px;
  animation: slideIn 0.3s ease;

  /* Ẩn thanh cuộn */
  scrollbar-width: none; /* Firefox */
}

.modal-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  z-index: 1;
}

.close-button:hover {
  color: #333;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .modal-container {
    max-width: 95%;
    margin: 10px;
  }
}
</style>
