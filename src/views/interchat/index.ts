export {};

module.exports = (ctx: any): string => {
	const activeInterchatID = ctx.params.id;

	const interchats = [
		{
			id: 'es',
			avatar: 'https://cdn.chatglobal.ml/assets/logo.png',
			name: 'Interchat español',
			description: 'Interchat español de Chat Global Oficial.',
			banner: 'https://cdn.chatglobal.ml/assets/thumbnail.png'
		},
		{
			id: 'en',
			avatar: 'https://cdn.discordapp.com/attachments/923615661031317554/924342056405585970/1200px-SAS_Group_logo.png',
			name: 'English Interchat',
			description: 'amongus',
			banner: 'https://cdn.discordapp.com/attachments/923615661031317554/924342056405585970/1200px-SAS_Group_logo.png'
		},
		{
			id: 'amogus',
			avatar: 'https://logos-marcas.com/wp-content/uploads/2021/08/Among-Us-Logo.png',
			name: 'amogus',
			description: 'amongus',
			banner: 'https://logos-marcas.com/wp-content/uploads/2021/08/Among-Us-Logo.png'
		}
	];

	const activeInterchat = interchats.find(
		(interchat) => interchat.id == activeInterchatID
	);

	return /*html*/ `
        <div class="main-cards" id="current-interchat" interchat-id="${activeInterchatID}">
            <aside class="card h-100 main-card" id="interchats-card" aria-label="Interchats">
                <div class="interchats-body">
                    ${interchats
						.map((interchat) => {
							const isActiveInterchat =
								interchat.id === activeInterchatID;
							return /*html*/ `
                            <${
								isActiveInterchat ? 'div' : 'a'
							} class="interchat-logo${
								isActiveInterchat ? ' interchat-active' : ''
							}" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-offset="0,18" title="${
								interchat.name
							}" ${
								isActiveInterchat
									? ''
									: `href="/interchat/${interchat.id}"`
							} data-link>
                                <img src="${
									interchat.avatar
								}" class="card-img interchat-logo-img" alt="Logo">
                            </${isActiveInterchat ? 'div' : 'a'}>
                        `;
						})
						.join('')}
                </div>
            </aside>
            <div class="card h-100 main-card" id="interchat-menu-card">
                <img src="${
					activeInterchat.banner
				}" class="card-img-top no-border-radius interchat-banner" alt="Banner">
                <div class="card-body">
                    <h5 class="card-title">${activeInterchat.name}</h5>
                    <p class="card-text">${activeInterchat.description}</p>
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
                            <div id="emojis">
                            </div>
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
                    <p class="card-title">Miembros online</p>
                    <div id="members-online" class="row row-cols-1 g-2">
                        <p class="card-text">Sin miembros online.</p>
                    </div>
                </div>
            </aside>
        </div>
    `;
};
