export {};

module.exports = (ctx: any): string => /*html*/ ` 
  <main>
    <section>
      <form id="register" action="">
        <label>Email</label>
        <input type="email" name="email" />
        <label>Password</label>
        <input type="password" name="password" />
        <button>Register</button>
      </form>
    </section>
  </main>
`;
