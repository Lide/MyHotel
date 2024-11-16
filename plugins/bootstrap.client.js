import * as bootstrap from "bootstrap";
const { Modal, Collapse, Dropdown } = bootstrap; // 修改為大寫 D 的 Dropdown

export default defineNuxtPlugin((_nuxtApp) => {
	return {
		provide: {
			bootstrap: {
				modal: (element) => new Modal(element),
				collapse: (element) => new Collapse(element),
				dropdown: (element) => new Dropdown(element),
			},
		},
	};
});
