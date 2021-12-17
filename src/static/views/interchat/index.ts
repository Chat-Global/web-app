export {};

module.exports = (ctx) => /*html*/ `
  <div class="container">
    <a href="https://chatglobal.tnfangel.ml/" class="brand"><img src="/assets/logo.png" alt="Logo" width="140" height="140"></a>

    <h2>Viendo post ${decodeURIComponent(ctx.params.id)}</h2>
    <h1>Sasilla.</h1>

    <p>Que tal</p>

    <a href="/posts" data-link>Volver</a>.
  </div>
`;
