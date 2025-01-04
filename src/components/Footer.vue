<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row justify-content-center">
        <!-- Logo và slogan -->
        <div class="col-md-3 mb-4 text-center">
          <h3 class="brand-logo">Jadoo.</h3>
          <p class="text-muted small">
            Book your trip in minute, get full <br />
            control for much longer.
          </p>
        </div>
        <!-- Cột "Company" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">Company</h5>
          <ul class="list-unstyled">
            <li><a href="/about" class="text-muted">About</a></li>
            <li><a href="#" class="text-muted">Careers</a></li>
            <li><a href="#" class="text-muted">Mobile</a></li>
          </ul>
        </div>
        <!-- Cột "Contact" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">Contact</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted">Help/FAQ</a></li>
            <li><a href="#" class="text-muted">Press</a></li>
            <li><a href="#" class="text-muted">Affiliates</a></li>
          </ul>
        </div>
        <!-- Cột "More" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">More</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted">Airlinefees</a></li>
            <li><a href="#" class="text-muted">Airline</a></li>
            <li><a href="#" class="text-muted">Low fare tips</a></li>
          </ul>
        </div>
        <!-- Cột ứng dụng -->
        <div class="col-md-3 mb-4 text-center">
          <div class="mb-3">
            <a href="#" class="me-2 text-dark">
              <img src="\images\footer\fb.png" class="social" />
            </a>
            <a href="#" class="me-2 text-dark">
              <img src="\images\footer\ins.png" class="social" />
            </a>
            <a href="#" class="text-dark">
              <img src="\images\footer\tw.png" class="social" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.brand-logo {
  font-size: 3rem;
}
.social {
  width: 40px;
  height: 40px;
  margin-right: 2rem;
}

a {
  text-decoration: none;
  color: #000;
}
.footer {
  background-color: #FFF8EF;
}
</style>
