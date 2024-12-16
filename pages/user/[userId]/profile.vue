<script setup>
definePageMeta({
	middleware: "auth",
});

const isEditPassword = ref(false);
const isEditProfile = ref(false);

const cookie = useCookie("auth");

// 設定日期格式
const selectedYear = ref(0);
const selectedMonth = ref(0);
const selectedDays = ref(0);
const birthday = computed(() => {
	return `${selectedYear.value}/${selectedMonth.value}/${selectedDays.value}`;
});

const { data: userDataResult } = await useFetch(`api/v1/user/`, {
	baseURL: "https://nuxr3.zeabur.app/",
	method: "GET",
	immediate: true,
	watch: false,
	headers: {
		authorization: cookie.value,
	},
});
const userData = ref(userDataResult.value.result);

const { execute: fetchUpdateUser } = useFetch("api/v1/user", {
	baseURL: "https://nuxr3.zeabur.app/",
	method: "PUT",
	body: userData,
	immediate: false,
	watch: false,
	headers: {
		authorization: cookie.value,
	},
	onResponse: ({ response }) => {
		if (response.status === 200) {
			alert("儲存成功");
			isEditProfile.value = false;
		} else {
			console.log("Update failed:", response._data.message);
			alert(response._data.message);
		}
	},
});

const updatePassword = ref({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
});

const updatePasswordData = ref({
	userId: userData.value._id,
	oldPassword: updatePassword.value.oldPassword,
	newPassword: updatePassword.value.newPassword,
});

// 更新密碼
const { execute: fetchUpdatePassword } = useFetch("api/v1/user", {
	baseURL: "https://nuxr3.zeabur.app/",
	method: "PUT",
	body: updatePasswordData,
	immediate: false,
	watch: false,
	headers: {
		authorization: cookie.value,
	},
	onResponse: ({ response }) => {
		if (response.status === 200) {
			alert("密碼更新成功");
			isEditPassword.value = false;
		} else {
			console.log("Update Password failed:", response._data.message);
			alert(response._data.message);
		}
	},
});

async function submitUpdateUser() {
	userData.value.birthday = birthday.value;
	userData.value.userId = userData.value._id;
	await fetchUpdateUser();
}

async function submitUpdatePassword() {
	if (!checkPassword()) return;
	await fetchUpdatePassword();
}

// '1960-02-04T00:00:00.000Z' => '1960 年 02 月 04 日'
const getBirthdayDesc = () => {
	const date = new Date(userData.value.birthday);
	const year = date.getFullYear();
	// 不足兩位數補 0
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year} 年 ${month} 月 ${day} 日`;
};

const getBirthdayYear = () => {
	const date = new Date(userData.value.birthday);
	return date.getFullYear();
};

const getBirthdayMonth = () => {
	const date = new Date(userData.value.birthday);
	return date.getMonth() + 1;
};

const getBirthdayDay = () => {
	const date = new Date(userData.value.birthday);
	return date.getDate();
};

selectedYear.value = getBirthdayYear();
selectedMonth.value = getBirthdayMonth();
selectedDays.value = getBirthdayDay();

// 密碼檢查
const checkPassword = () => {
	if (updatePassword.value.oldPassword === "") {
		alert("請輸入舊密碼");
		return false;
	}
	if (updatePassword.value.newPassword === "") {
		alert("請輸入新密碼");
		return false;
	}
	if (updatePassword.value.confirmPassword === "") {
		alert("請再輸入一次新密碼");
		return false;
	}
	if (
		updatePassword.value.newPassword !== updatePassword.value.confirmPassword
	) {
		alert("新密碼與確認密碼不一致");
		return false;
	}
	if (updatePassword.value.newPassword === updatePassword.value.oldPassword) {
		alert("新密碼與舊密碼相同");
		return false;
	}
	if (updatePassword.value.newPassword.length < 8) {
		alert("密碼長度必須至少為8個字符");
		return false;
	}
	// 密碼必須包含至少一個字母和一個數字
	const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!passwordPattern.test(updatePassword.value.newPassword)) {
		alert("密碼必須包含至少一個字母和一個數字");
		return false;
	}
	return true;
};
</script>

<template>
	<div class="row gap-6 gap-md-0">
		<div class="col-12 col-md-5">
			<section
				class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
			>
				<h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
				<div class="d-flex flex-column gap-4 gap-md-6">
					<div class="fs-8 fs-md-7">
						<p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
						<span
							class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
							>{{ userData.email }}</span
						>
					</div>

					<div
						class="d-flex justify-content-between align-items-center"
						:class="{ 'd-none': isEditPassword }"
					>
						<div>
							<label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
								密碼
							</label>
							<input
								class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
								type="password"
								value="**********"
							/>
						</div>

						<button
							class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
							type="button"
							@click="isEditPassword = !isEditPassword"
						>
							重設
						</button>
					</div>

					<div
						class="d-flex flex-column gap-4 gap-md-6"
						:class="{ 'd-none': !isEditPassword }"
					>
						<div>
							<label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold"
								>舊密碼</label
							>
							<input
								id="oldPassword"
								type="password"
								class="form-control p-4 fs-7 rounded-3"
								placeholder="請輸入舊密碼"
								v-model="updatePassword.oldPassword"
							/>
						</div>

						<div>
							<label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold"
								>新密碼</label
							>
							<input
								id="newPassword"
								type="password"
								class="form-control p-4 fs-7 rounded-3"
								placeholder="請輸入新密碼"
								v-model="updatePassword.newPassword"
							/>
						</div>

						<div>
							<label
								for="confirmPassword"
								class="form-label fs-8 fs-md-7 fw-bold"
								>確認新密碼</label
							>
							<input
								id="confirmPassword"
								type="password"
								class="form-control p-4 fs-7 rounded-3"
								placeholder="請再輸入一次新密碼"
								v-model="updatePassword.confirmPassword"
							/>
						</div>
					</div>

					<button
						:class="{ 'd-none': !isEditPassword }"
						class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
						type="button"
						@click="submitUpdatePassword"
					>
						儲存設定
					</button>
				</div>
			</section>
		</div>

		<div class="col-12 col-md-7">
			<section
				class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
			>
				<h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
				<div class="d-flex flex-column gap-4 gap-md-6">
					<div class="fs-8 fs-md-7">
						<label
							class="form-label"
							:class="{
								'fw-bold text-neutral-100': isEditProfile,
								'fw-medium text-neutral-80': !isEditProfile,
							}"
							for="name"
						>
							姓名
						</label>
						<input
							id="name"
							name="name"
							class="form-control text-neutral-100 fw-bold"
							:class="{
								'pe-none p-0 border-0': !isEditProfile,
								'p-4': isEditProfile,
							}"
							type="text"
							v-model="userData.name"
						/>
					</div>

					<div class="fs-8 fs-md-7">
						<label
							class="form-label"
							:class="{
								'fw-bold text-neutral-100': isEditProfile,
								'fw-medium text-neutral-80': !isEditProfile,
							}"
							for="phone"
						>
							手機號碼
						</label>
						<input
							id="phone"
							name="phone"
							class="form-control text-neutral-100 fw-bold"
							:class="{
								'pe-none p-0 border-0': !isEditProfile,
								'p-4': isEditProfile,
							}"
							type="tel"
							v-model="userData.phone"
						/>
					</div>

					<div class="fs-8 fs-md-7">
						<label
							class="form-label"
							:class="{
								'fw-bold text-neutral-100': isEditProfile,
								'fw-medium text-neutral-80': !isEditProfile,
							}"
							for="birth"
						>
							生日
						</label>
						<span
							class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
							:class="{ 'd-none': isEditProfile }"
							>{{ getBirthdayDesc() }}</span
						>
						<div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
							<select
								id="birth"
								class="form-select p-4 text-neutral-80 fw-medium rounded-3"
								v-model="selectedYear"
							>
								<option v-for="year in 65" :key="year" :value="year + 1958">
									{{ year + 1958 }} 年
								</option>
							</select>
							<select
								class="form-select p-4 text-neutral-80 fw-medium rounded-3"
								v-model="selectedMonth"
							>
								<option v-for="month in 12" :key="month" :value="month">
									{{ month }} 月
								</option>
							</select>
							<select
								class="form-select p-4 text-neutral-80 fw-medium rounded-3"
								v-model="selectedDays"
							>
								<option v-for="day in 30" :key="day" :value="day">
									{{ day }} 日
								</option>
							</select>
						</div>
					</div>

					<div class="fs-8 fs-md-7">
						<label
							class="form-label"
							:class="{
								'fw-bold text-neutral-100': isEditProfile,
								'fw-medium text-neutral-80': !isEditProfile,
							}"
							for="address"
						>
							地址
						</label>
						<span
							class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
							:class="{ 'd-none': isEditProfile }"
							>{{ userData.address.detail }}</span
						>
						<div :class="{ 'd-none': !isEditProfile }">
							<div class="d-flex gap-2 mb-2">
								<select
									class="form-select p-4 text-neutral-80 fw-medium rounded-3"
								>
									<option value="臺北市">臺北市</option>
									<option value="臺中市">臺中市</option>
									<option selected value="高雄市">高雄市</option>
								</select>
								<select
									class="form-select p-4 text-neutral-80 fw-medium rounded-3"
								>
									<option value="前金區">前金區</option>
									<option value="鹽埕區">鹽埕區</option>
									<option selected value="新興區">新興區</option>
								</select>
							</div>
							<input
								id="address"
								type="text"
								class="form-control p-4 rounded-3"
								placeholder="請輸入詳細地址"
								v-model="userData.address.detail"
							/>
						</div>
					</div>
				</div>
				<button
					:class="{ 'd-none': isEditProfile }"
					class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
					type="button"
					@click="isEditProfile = !isEditProfile"
				>
					編輯
				</button>

				<button
					:class="{ 'd-none': !isEditProfile }"
					class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
					type="button"
					@click="submitUpdateUser"
				>
					儲存設定
				</button>
			</section>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
	border-radius: 1.25rem;
}

input[type="password"] {
	font: small-caption;
}

.form-control::placeholder {
	--neutral-60: #909090;
	color: var(--neutral-60);
	font-weight: 500;
}
</style>
