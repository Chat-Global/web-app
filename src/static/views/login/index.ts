export {};

module.exports = (ctx: any): string => /*html*/ ` 
    <main>
      <section>
        <form id="login">
          <label>Login</label>
          <input type="text" name="login" />
          <label>Password</label>
          <input type="password" name="password" />
          <button>Log in</button>
        </form>
      </section>
    </main>
`;
