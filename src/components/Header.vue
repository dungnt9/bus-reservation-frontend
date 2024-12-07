<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container">
      <a class="navbar-brand" href="#">Jadoo</a>
      <!-- Nút toggle menu cho màn hình nhỏ -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Menu chính -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="/">Trang chủ</a></li>
          <li class="nav-item"><a class="nav-link" href="/book">Đặt vé</a></li>
          <li class="nav-item"><a class="nav-link" href="/track">Theo dõi chuyến xe</a></li>
          <li class="nav-item"><a class="nav-link" href="/invoice">Hóa đơn</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Login</a></li>
          <li class="nav-item"><button class="sign-up-button">Sign up</button></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff8ef;
  font-family: Arial, sans-serif;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: orange;
}

.navbar-menu {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ffa500; /* Orange hover effect */
}

.sign-up-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid #333;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.sign-up-button:hover {
  background-color: #ffa500;
  color: white;
}

.language-selector {
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
}

.dropdown-icon {
  margin-left: 0.3rem;
  font-size: 0.8rem;
}

li {
  margin-right: 2rem;
}
</style>
