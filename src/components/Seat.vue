<template>
  <div class="seat-container">
    <h5 class="text-center mb-3">Sơ đồ chỗ ngồi</h5>

    <div class="main-grid">
      <!-- Cột 1: Lái xe và các ghế -->
      <button class="position-box" style="grid-column: 1; grid-row: 1;">Lái Xe</button>
      <button v-for="seatNum in [1,5,9,13,17,21,25,29,33,37]"
              :key="seatNum"
              class="seat-btn"
              :class="{
                'selected': modelValue.includes(seatNum),
                'booked': bookedSeats.includes(seatNum)
              }"
              :disabled="bookedSeats.includes(seatNum)"
              :style="`grid-column: 1; grid-row: ${Math.floor((seatNum-1)/4) + 2}`"
              @click="handleSeatClick(seatNum)">
        {{ seatNum }}
      </button>
      <button class="seat-btn"
              :class="{
                'selected': modelValue.includes(41),
                'booked': bookedSeats.includes(41)
              }"
              :disabled="bookedSeats.includes(41)"
              style="grid-column: 1; grid-row: 12;"
              @click="handleSeatClick(41)">
        41
      </button>

      <!-- Cột 2: Các ghế -->
      <button v-for="seatNum in [2,6,10,14,18,22,26,30,34,38]"
              :key="seatNum"
              class="seat-btn"
              :class="{
                'selected': modelValue.includes(seatNum),
                'booked': bookedSeats.includes(seatNum)
              }"
              :disabled="bookedSeats.includes(seatNum)"
              :style="`grid-column: 2; grid-row: ${Math.floor((seatNum-1)/4) + 2}`"
              @click="handleSeatClick(seatNum)">
        {{ seatNum }}
      </button>
      <button class="seat-btn"
              :class="{
                'selected': modelValue.includes(42),
                'booked': bookedSeats.includes(42)
              }"
              :disabled="bookedSeats.includes(42)"
              style="grid-column: 2; grid-row: 12;"
              @click="handleSeatClick(42)">
        42
      </button>

      <!-- Cột 3: Phụ xe và ghế 43 -->
      <button class="position-box" style="grid-column: 3; grid-row: 1;">Phụ Xe</button>
      <button class="seat-btn"
              :class="{
                'selected': modelValue.includes(43),
                'booked': bookedSeats.includes(43)
              }"
              :disabled="bookedSeats.includes(43)"
              style="grid-column: 3; grid-row: 12;"
              @click="handleSeatClick(43)">
        43
      </button>

      <!-- Cột 4: Các ghế -->
      <button v-for="seatNum in [3,7,11,15,19,23,27,31,35,39]"
              :key="seatNum"
              class="seat-btn"
              :class="{
                'selected': modelValue.includes(seatNum),
                'booked': bookedSeats.includes(seatNum)
              }"
              :disabled="bookedSeats.includes(seatNum)"
              :style="`grid-column: 4; grid-row: ${Math.floor((seatNum-1)/4) + 2}`"
              @click="handleSeatClick(seatNum)">
        {{ seatNum }}
      </button>
      <button class="seat-btn"
              :class="{
                'selected': modelValue.includes(44),
                'booked': bookedSeats.includes(44)
              }"
              :disabled="bookedSeats.includes(44)"
              style="grid-column: 4; grid-row: 12;"
              @click="handleSeatClick(44)">
        44
      </button>

      <!-- Cột 5: Cửa và các ghế -->
      <button class="position-box" style="grid-column: 5; grid-row: 1;">Cửa</button>
      <button v-for="seatNum in [4,8,12,16,20,24,28,32,36,40]"
              :key="seatNum"
              class="seat-btn"
              :class="{
                'selected': modelValue.includes(seatNum),
                'booked': bookedSeats.includes(seatNum)
              }"
              :disabled="bookedSeats.includes(seatNum)"
              :style="`grid-column: 5; grid-row: ${Math.floor((seatNum-1)/4) + 2}`"
              @click="handleSeatClick(seatNum)">
        {{ seatNum }}
      </button>
      <button class="seat-btn"
              :class="{
                'selected': modelValue.includes(45),
                'booked': bookedSeats.includes(45)
              }"
              :disabled="bookedSeats.includes(45)"
              style="grid-column: 5; grid-row: 12;"
              @click="handleSeatClick(45)">
        45
      </button>
    </div>

    <div class="seat-legend">
      <div class="legend-item">
        <div class="legend-box available"></div>
        <span>Ghế trống</span>
      </div>
      <div class="legend-item">
        <div class="legend-box selected"></div>
        <span>Ghế đã chọn</span>
      </div>
      <div class="legend-item">
        <div class="legend-box booked"></div>
        <span>Ghế đã đặt</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
    default: () => []
  },
  bookedSeats: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'seatSelected'])

const handleSeatClick = (seatNumber) => {
  if (props.bookedSeats.includes(seatNumber)) {
    return
  }

  const newSelectedSeats = [...props.modelValue]
  const seatIndex = newSelectedSeats.indexOf(seatNumber)

  if (seatIndex === -1) {
    newSelectedSeats.push(seatNumber)
  } else {
    newSelectedSeats.splice(seatIndex, 1)
  }

  emit('update:modelValue', newSelectedSeats)
  emit('seatSelected', newSelectedSeats)
}
</script>

<style scoped>
.seat-container {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.main-grid {
  display: grid;
  grid-template-columns: repeat(5, 60px);
  gap: 10px 40px;
  justify-content: center;
  padding: 20px;
}

.position-box {
  padding: 8px 0;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  width: 60px;
  height: 35px;
}

.seat-btn {
  width: 60px;
  height: 35px;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.seat-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.seat-btn.selected {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.seat-btn.booked {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
  cursor: not-allowed;
}

.seat-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.seat-legend {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 20px;
  padding: 0 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-box {
  width: 60px;
  height: 35px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.legend-box.available {
  background-color: white;
}

.legend-box.selected {
  background-color: #28a745;
}

.legend-box.booked {
  background-color: #dc3545;
}
</style>
