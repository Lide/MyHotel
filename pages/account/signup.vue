<script setup>
import { Icon } from "@iconify/vue";
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const phone = ref("");
const zipcode = ref(0);
const detail = ref("");

// 設定日期格式
const selectedYear = ref("");
const selectedMonth = ref("");
const selectedDays = ref("");
const birthday = computed(() => {
	return `${selectedYear.value}/${selectedMonth.value}/${selectedDays.value}`;
});

const body = computed(() => ({
	name: name.value,
	email: email.value,
	password: password.value,
	phone: phone.value,
	birthday: birthday.value,
	address: {
		zipcode: zipcode.value,
		detail: detail.value,
	},
}));

const { execute: fetchSignup } = useFetch("api/v1/user/signup", {
	baseURL: "https://nuxr3.zeabur.app/",
	method: "POST",
	body: body,
	immediate: false,
	watch: false,
	onResponse: ({ response }) => {
		if (response.status === 200) {
			console.log("Signup success");
			alert("註冊成功");
			// 跳轉到登入頁面
			router.push("login");
		} else {
			console.log("Signup failed:", response._data.message);
			alert(response._data.message);
		}
	},
});

async function submitSignup() {
	console.log(body.value);
	await fetchSignup();
}

const isEmailAndPasswordValid = ref(false);

const validateEmailAndPassword = () => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email.value)) {
		alert("請輸入有效的電子郵件地址");
		return;
	}
	if (password.value.length < 8) {
		alert("密碼長度必須至少為8個字符");
		return;
	}
	// 密碼必須包含至少一個字母和一個數字
	const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!passwordPattern.test(password.value)) {
		alert("密碼必須包含至少一個字母和一個數字");
		return;
	}
	if (password.value !== confirmPassword.value) {
		alert("密碼和確認密碼不一致");
		return;
	}
	// 如果所有驗證都通過，則進行下一步操作
	isEmailAndPasswordValid.value = true;
};

const validateOthers = () => {
	if (name.value === "") {
		alert("請輸入姓名");
		return;
	}
	if (phone.value === "") {
		alert("請輸入手機號碼");
		return;
	}
	// 手機號碼格式驗證
	const phonePattern = /^09\d{8}$/;
	if (!phonePattern.test(phone.value)) {
		alert("請輸入有效的手機號碼");
		return;
	}
	if (birthday.value === "") {
		alert("請選擇生日");
		return;
	}
	// 生日格式驗證
	const birthdayPattern = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
	if (!birthdayPattern.test(birthday.value)) {
		alert("請輸入有效的生日");
		return;
	}
	if (zipcode.value === 0) {
		alert("請選擇地址");
		return;
	}
	if (detail.value === "") {
		alert("請輸入詳細地址");
		return;
	}
	if (!document.getElementById("agreementCheck").checked) {
		alert("請閱讀並同意本網站個資使用規範");
		return;
	}
	// 如果所有驗證都通過，則進行下一步操作
	submitSignup();
};
</script>

<template>
	<div class="p-5 px-md-0 py-md-30">
		<div class="mb-10">
			<p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
				享樂酒店，誠摯歡迎
			</p>
			<h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

			<div class="d-flex align-items-center py-4 gap-2">
				<div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
					<span
						:class="{ 'd-none': isEmailAndPasswordValid }"
						class="step p-2 bg-primary-100 rounded-circle"
						>1</span
					>
					<Icon
						:class="{ 'd-none': !isEmailAndPasswordValid }"
						class="p-2 fs-3 bg-primary-100 rounded-circle"
						icon="material-symbols:check"
					/>
					<p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
				</div>

				<hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

				<div
					:class="{
						'text-neutral-0': isEmailAndPasswordValid,
						'text-neutral-60': !isEmailAndPasswordValid,
					}"
					class="d-flex flex-column align-items-center gap-1"
				>
					<span
						:class="{
							'bg-primary-100': isEmailAndPasswordValid,
							'bg-transparent border border-neutral-60':
								!isEmailAndPasswordValid,
						}"
						class="step p-2 rounded-circle"
						>2</span
					>
					<p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
				</div>
			</div>
		</div>

		<div class="mb-4">
			<form :class="{ 'd-none': isEmailAndPasswordValid }" class="mb-4">
				<div class="mb-4 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="email">
						電子信箱
					</label>
					<input
						id="email"
						class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
						placeholder="請輸入信箱"
						type="email"
						v-model="email"
					/>
				</div>
				<div class="mb-4 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="password">
						密碼
					</label>
					<input
						id="password"
						class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
						placeholder="請輸入密碼"
						type="password"
						v-model="password"
					/>
				</div>
				<div class="mb-10 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
						確認密碼
					</label>
					<input
						id="confirmPassword"
						class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
						placeholder="請再輸入一次密碼"
						type="password"
						v-model="confirmPassword"
					/>
				</div>
				<button
					class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
					type="button"
					@click="validateEmailAndPassword"
				>
					下一步
				</button>
			</form>
			<form :class="{ 'd-none': !isEmailAndPasswordValid }" class="mb-4">
				<div class="mb-4 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
					<input
						id="name"
						class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
						placeholder="請輸入姓名"
						type="text"
						v-model="name"
					/>
				</div>
				<div class="mb-4 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="phone">
						手機號碼
					</label>
					<input
						id="phone"
						class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
						placeholder="請輸入手機號碼"
						type="tel"
						v-model="phone"
					/>
				</div>
				<div class="mb-4 fs-8 fs-md-7">
					<label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
					<div class="d-flex gap-2">
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
				<div class="mb-4 fs-8 fs-md-7">
					<label class="form-label text-neutral-0 fw-bold" for="address">
						地址
					</label>
					<div>
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
								v-model="zipcode"
							>
								<option value="101">前金區</option>
								<option value="102">鹽埕區</option>
								<option selected value="103">新興區</option>
							</select>
						</div>
						<input
							id="address"
							type="text"
							class="form-control p-4 rounded-3"
							placeholder="請輸入詳細地址"
							v-model="detail"
						/>
					</div>
				</div>

				<div
					class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
				>
					<input
						id="agreementCheck"
						class="form-check-input"
						type="checkbox"
						value=""
					/>
					<label class="form-check-label fw-bold" for="agreementCheck">
						我已閱讀並同意本網站個資使用規範
					</label>
				</div>
				<button
					class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
					type="button"
					@click="validateOthers"
				>
					完成註冊
				</button>
			</form>
		</div>

		<p class="mb-0 fs-8 fs-md-7">
			<span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
			<NuxtLink
				to="login"
				class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
			>
				<span>立即登入</span>
			</NuxtLink>
		</p>
	</div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
	xs: 0,
	sm: 576px,
	md: 768px,
	lg: 992px,
	xl: 1200px,
	xxl: 1400px,
	xxxl: 1537px,
);

input[type="password"] {
	font: small-caption;
	font-size: 1.5rem;
}

input::placeholder {
	color: #909090;
	font-size: 1rem;
	font-weight: 500;

	@include media-breakpoint-down(md) {
		font-size: 14px;
	}
}

.form-check-input {
	width: 1.5rem;
	height: 1.5rem;
}

.form-check-input:checked {
	background-color: #bf9d7d;
	border-color: #bf9d7d;
}

.step {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
}
</style>
