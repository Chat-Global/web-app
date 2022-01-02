export {};

module.exports = (ctx: any): string => /*html*/ `
  <main>
    <section class="register-container">
      <div id="particles-container"></div>
      <div class="card text-center register-card">
        <div class="card-body">
          <h5 class="card-title"><img class="title-logo" src="https://cdn.chatglobal.ml/assets/logo.png" alt="Logo">Chat Global Register</h5>
          <br>
          <form id="register" action="">
            <div class="control-group">
              <input type="text" name="username" class="register-field" value="" placeholder="Nombre de usuario" id="register-username">
            </div>
            <div class="control-group">
              <input type="email" name="email" class="register-field" value="" placeholder="Email" id="register-email">
            </div>
            <div class="control-group">
              <input type="password" name="password" class="register-field" value="" placeholder="Contraseña" id="register-pass">
            </div>
            <div class="control-group">
              <div class="h-captcha" data-sitekey="5c1c7a42-ebd9-494b-b289-a752ab49e12d"></div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
            </svg>
            <div class="control-group">
              <div class="alert alert-danger d-flex align-items-center hidden" id="error_notification" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:">
                  <use xlink:href="#exclamation-triangle-fill"/>
                </svg>
              <div id="error_notification_text"></div>
              </div>
            </div>
            <div class="control-group">
              <button class="btn btn-primary btn-large btn-block" type="submit" id="login_button">Iniciar sesión</button>
            </div>
            <a class="login-link" href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
          </form>
        </div>
      </div>
    </section>
  </main>
`;
