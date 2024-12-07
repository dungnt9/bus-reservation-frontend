<template>
  <div class="home-container">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-container">
          <h1 class="display-4 fw-bold">
            Travel, <span class="text-warning">enjoy</span> and live a new and full life
          </h1>
          <p class="lead">Best destinations around the world</p>
          <div class="d-flex gap-3">
            <button class="btn btn-primary">Find out more</button>
          </div>
        </div>
        <div class="col-md-6 image-container">
          <img src="/images/homepage/Traveller 1.svg" alt="Traveller 1" class="img-fluid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home-container {
  background-color: #ffffff;
  padding-top: 20px;
  padding-bottom: 20px;
  position: relative;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
}

.text-warning {
  color: #ff5722;
}

img.img-fluid {
  max-width: 90%;
  height: auto;
  opacity: 0;
  transform: translateX(100px);
  animation: moveImage 1s ease-out forwards;
}

.text-container {
  transform: translateY(30px);
  opacity: 0;
  animation: moveText 1s ease-out forwards;
}

@keyframes moveImage {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes moveText {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.btn-primary {
  background-color: #ff5722;
  border: none;
}

.btn-outline-secondary {
  color: #333;
  border-color: #333;
}
</style>
