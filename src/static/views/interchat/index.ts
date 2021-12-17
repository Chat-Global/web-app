export {};

module.exports = (ctx: any): string => /*html*/ `
  <div class="container">
    <a href="https://chatglobal.ml/" class="brand"><img src="https://cdn.chatglobal.ml/assets/logo.png" alt="Logo" width="140" height="140"></a>

    <h2>Viendo interchat ${decodeURIComponent(ctx.params.id)}</h2>
    <h1>Qu.</h1>

    <p>Que tal</p>

    <a href="/posts" data-link>Volver</a>.
  </div>
`;
