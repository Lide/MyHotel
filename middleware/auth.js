export default defineNuxtRouteMiddleware(async (to, from) => {
	const nuxtApp = useNuxtApp();
	const cookie = useCookie("auth");

	if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
		return;
	}

	if (!cookie.value) {
		return navigateTo("/account/login");
	}

	const { data, error } = await useFetch("api/v1/user/check", {
		baseURL: "https://nuxr3.zeabur.app/",
		method: "GET",
		headers: {
			authorization: cookie.value,
		},
	});

	if (error.value) {
		cookie.value = null;
		alert(error.value.message);
		return navigateTo("/account/login");
	}

	if (data.value) {
		cookie.value = data.value.token;
		return;
	}
});
