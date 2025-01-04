<template>
  <footer class="footer py-5">
    <div class="container">
      <div class="row justify-content-center">
        <!-- Logo và slogan -->
        <div class="col-md-3 mb-4 text-center">
          <h3 class="brand-logo">Xe khách Hải Phòng</h3>
          <p class="text-muted small">
            Đặt vé dễ dàng, tận hưởng chuyến đi <br />
            thoải mái và an toàn.
          </p>
        </div>
        <!-- Cột "Giới thiệu" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">Giới thiệu</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted">Về chúng tôi</a></li>
            <li><a href="#" class="text-muted">Tuyển dụng</a></li>
            <li><a href="#" class="text-muted">Ứng dụng di động</a></li>
          </ul>
        </div>
        <!-- Cột "Liên hệ" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">Liên hệ</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted">Trợ giúp/Hỏi đáp</a></li>
            <li><a href="#" class="text-muted">Báo chí</a></li>
            <li><a href="#" class="text-muted">Đối tác</a></li>
          </ul>
        </div>
        <!-- Cột "Khám phá thêm" -->
        <div class="col-md-2 mb-4 text-center">
          <h5 class="fw-bold mb-3">Khám phá thêm</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-muted">Giá vé ưu đãi</a></li>
            <li><a href="#" class="text-muted">Các tuyến xe</a></li>
            <li><a href="#" class="text-muted">Mẹo đặt vé</a></li>
          </ul>
        </div>
        <!-- Cột ứng dụng -->
        <div class="col-md-3 mb-4 text-center">
          <div class="mb-3">
            <a href="#" class="me-2 text-dark">
              <img src="/images/footer/fb.png" class="social" alt="Facebook" />
            </a>
            <a href="#" class="me-2 text-dark">
              <img src="/images/footer/ins.png" class="social" alt="Instagram" />
            </a>
            <a href="#" class="text-dark">
              <img src="/images/footer/tw.png" class="social" alt="Twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.brand-logo {
  font-size: 2rem;
  color: orange;
}

.fw-bold {
  color: orange;
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
