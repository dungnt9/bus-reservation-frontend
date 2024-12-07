<template>
  <div>
    <div class="coming-soon">
      <img src="/images/comingSoon/background.svg" alt="Background" class="background-image" />
      <img src="/images/comingSoon/icon-face.svg" alt="Icon" class="icon-image" />
      <h1>Coming soon...</h1>
      <p>
        Jadoo vẫn đang nỗ lực phát triển tính năng để mang tới trải nghiệm tốt nhất cho bạn. Hãy đón
        chờ nhé!
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const iconImage = document.querySelector('.icon-image')
  const random = Math.floor(Math.random() * 2)
  iconImage.src = `/images/comingSoon/icon-${random === 0 ? 'face' : 'full-body'}.svg`
})
</script>

<style scoped>
.coming-soon {
  position: relative;
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.coming-soon h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--clr-blue);
}

.coming-soon p {
  font-size: 1rem;
  font-style: italic;
  font-weight: 300;
  position: relative;
}

.coming-soon p span {
  display: block;
}

@keyframes snow {
  0% {
    transform: translateY(-75%);
  }
  100% {
    transform: translateY(100%);
  }
}
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: snow 10s ease-out infinite;
}

.icon-image {
  display: block;
  margin: 0 auto 1.25rem auto;
  width: 14rem;
  height: auto;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

p {
  font-size: 1.125rem;
  font-weight: 300;
  text-align: center;
}
</style>
