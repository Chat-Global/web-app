export {};

module.exports = (ctx: any): string => /*html*/ ` 
    <main>
      <section>
        <form id="signup">
          <label>Login</label>
          <input type="text" name="login" />
          <label>Password</label>
          <input type="password" name="password" />
          <button>Sign up</button>
        </form>
      </section>
    </main>
`;
