export {};

module.exports = (ctx: any): string => /*html*/ `
  <div class="main-cards">
      <aside class="card h-100 main-card" id="interchats-card" aria-label="Interchats">
          <div class="interchats-body">
              <div class="interchat-logo">
                  <img src="https://cdn.chatglobal.ml/assets/logo.png" class="card-img interchat-logo-img" alt="Interchat logo">
              </div>
              <div class="interchat-logo interchat-active">
                  <img src="https://cdn.chatglobal.ml/assets/thumbnail.png" class="card-img interchat-logo-img" alt="Interchat logo">
              </div>
              <div class="interchat-logo">
                  <img src="https://cdn.discordapp.com/attachments/676853460733263882/921565315706535956/unknown.png" class="card-img interchat-logo-img" alt="Interchat logo">
              </div>
          </div>
      </aside>
      <div class="card h-100 main-card" id="interchat-menu-card">
          <img src="https://cdn.chatglobal.ml/assets/thumbnail.png" class="card-img-top no-border-radius" alt="Banner">
          <div class="card-body">
              <h5 class="card-title">Interchat español</h5>
              <p class="card-text">Interchat español de Chat Global Oficial.</p>
          </div>
      </div>    
      <div class="card h-100 main-card" id="interchat-messages-panel-card">
          <div class="card h-100" id="interchat-messages-card">
              <div class="card-body" id="messages-box">
                  <div id="interchat-messages">
                  </div>
              </div>
          </div>
          <div class="card h-100" id="interchat-panel-card">
              <div class="card-body">
                  <form id="message-form" action="">
                      <div id="message-panel">
                          <div id="attachments-div">
                              <div class="icon-container">
                                  <i class="fas fa-plus-circle interchat-bar-icon"></i>
                              </div>
                          </div>
                          <div id="message-input-box">
                              <input id="message-input" placeholder="Enviar un mensaje al interchat..." autocomplete="off" autofocus />
                          </div>
                          <div id="emojis-div">
                              <div class="icon-container">
                                  <i class="fas fa-grin-alt interchat-bar-icon"></i>
                              </div>
                          </div>
                          <div id="send-div">
                              <div class="icon-container">
                                  <i class="fas fa-paper-plane interchat-bar-icon"></i>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
      <aside class="card h-100 main-card" id="interchat-members-card" aria-label="Miembros">
          <div class="card-body">
              <h5 class="card-title">Miembros online</h5>
              <p class="card-text">Sin miembros conectados.</p>
          </div>
      </aside>
  </div>
`;
