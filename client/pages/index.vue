<template>
  <p v-if="pending" class="text-2xl font-medium">لطفا صبر کنید...</p>
  <div
    v-else
    dir="rtl"
    class="p-1 m-2 sm:m-10 mx-2 sm:mx-20 flex flex-col items-start"
  >
    <div class="flex place-items-center">
      <img class="h-28 ml-10" src="../static/icon.png" />
      <h1 class="text-2xl font-medium">
        فرم ثبت نام انجمن اسلامی دانشگاه تبریز
      </h1>
    </div>
    <div v-if="errors.length" class="mt-12">
      <b>لطفا ارورهای زیر را اصلاح کنید</b>
      <ul>
        <li v-for="error in errors" :key="error" class="text-red-900">
          {{ error }}
        </li>
      </ul>
    </div>
    <div v-if="me">
      <h1 class="text-2xl font-medium mt-6">ثبت نام شما موفقیت آمیز بود</h1>

      <p class="my-3">شماره دانشجویی : {{ me.studentNumber }}</p>
      <div class="flex flex-row items-center">
        <p>شماره تلفن: {{ me.phoneNumber }}</p>
        <button
          v-if="!pendingVerify && !me.verifyPhoneNumber"
          class="m-2 mr-6 py-2 px-5"
          @click="verify"
        >
          تایید شماره تلفن
        </button>
      </div>
      <div v-if="pendingVerify" class="flex flex-row items-center">
        <p>کد تایید را وارد نمایید</p>
        <input v-model="pin" type="text" />
        <button class="m-2 mr-6 py-2 px-5" @click="verifyLast" :disabled="!pin">
          تایید شماره تلفن
        </button>
      </div>
    </div>
    <form v-else class="my-12 text-lg flex flex-col w-4/5" @submit="submit">
      <p class="pb-4">فیلد‌های دارای * اجباری میباشند.</p>
      <h2 class="mb-2">۱. سوابق فردی</h2>
      <span>
        <input v-model="body.name" class="ml-4" placeholder="نام *" />
        <input v-model="body.familyName" placeholder="نام خانوادگی *" />
      </span>
      <span>
        <input
          v-model="body.studentNumber"
          class="ml-4"
          placeholder="شماره دانشجویی *"
        />
        <input v-model="body.nationalCode" placeholder="کد ملی *" />
      </span>
      <span>
        <span>
          <label for="dormitory"> خوابگاهی </label>
          <input
            v-model="body.dormitoryStudent"
            type="checkbox"
            class="ml-4 mr-1"
          />
        </span>
        <input
          v-model="body.dormitory"
          class="mr-1 w-15"
          placeholder="خوابگاه"
          :disabled="!body.dormitoryStudent"
        />
      </span>
      <span>
        <input
          v-model="body.phoneNumber"
          class="ml-4"
          placeholder="شماره تماس *"
        />
        <input v-model="body.email" placeholder="آدرس ایمیل" />
      </span>
      <h2>۲. سوابق تحصیلی</h2>
      <span class="school-profile my-6">
        <ul>
          <li class="pt-4 border-2 border-l-0"></li>
          <li class="pt-4 border-2 border-l-0">دانشگاه</li>
          <li class="pt-4 border-2 border-l-0">دانشکده</li>
          <li class="pt-4 border-2 border-l-0">رشته</li>
          <li class="pt-4 border-2 border-l-0">گرایش</li>
          <li class="pt-4 border-2 !border-l-2">ورودی</li>
        </ul>
        <ul class="middle-ul">
          <li class="pt-4 border-2 border-l-0">کارشناسی</li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[0].univercity" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[0].college" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[0].field" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[0].orientation" type="text" />
          </li>
          <li class="border-2 !border-l-2">
            <input v-model="body.schoolProfile[0].entrance" type="text" />
          </li>
        </ul>
        <ul class="middle-ul">
          <li class="pt-4 border-2 border-l-0">ارشد</li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[1].univercity" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[1].college" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[1].field" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[1].orientation" type="text" />
          </li>
          <li class="border-2 !border-l-2">
            <input v-model="body.schoolProfile[1].entrance" type="text" />
          </li>
        </ul>
        <ul class="middle-ul">
          <li class="pt-4 border-2 border-l-0">دکتری</li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[2].univercity" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[2].college" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[2].field" type="text" />
          </li>
          <li class="border-2 border-l-0">
            <input v-model="body.schoolProfile[2].orientation" type="text" />
          </li>
          <li class="border-2 !border-l-2">
            <input v-model="body.schoolProfile[2].entrance" type="text" />
          </li>
        </ul>
      </span>
      <span>
        <h2 class="pt-4">
          ۳. سابقه فعالیت (سیاسی، فرهنگی، اجتماعی، علمی، اجرایی و ...)
        </h2>
        <textarea
          v-model="body.activityRecords"
          name="activity-records"
          cols="30"
          rows="10"
        ></textarea>
      </span>
      <button class="self-start px-10 py-3 rounded-lg">ثبت نام</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage',
  data() {
    return {
      baseURL:
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3000`
          : `https://localhost:8000/api`,
      errors: [],
      pin: null,
      verifyReqId: 0,
      pendingVerify: false,
      accessToken: null,
      pending: false,
      me: null,
      body: {
        name: null,

        familyName: null,
        studentNumber: null,
        phoneNumber: null,
        nationalCode: null,
        email: null,
        dormitoryStudent: false,
        dormitory: null,
        activityRecords: null,
        schoolProfile: [
          {
            degree: 'BA',
            univercity: null,
            college: null,
            field: null,
            entrance: null,
          },
          {
            degree: 'MA',
            univercity: null,
            college: null,
            field: null,
            entrance: null,
          },
          {
            degree: 'PHD',
            univercity: null,
            college: null,
            field: null,
            entrance: null,
          },
        ],
      },
    };
  },

  mounted() {
    this.accessToken = this.getCookie('access_token');
    this.fetch();
  },

  methods: {
    async fetch() {
      const url =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3000/auth`
          : `https://localhost:8000/api/auth`;

      const res = await this.$axios.$get(`${url}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      try {
        this.me = await res;
      } catch (err: any) {
        console.log(res);
        console.log(err);
      }
    },

    async verify() {
      this.pendingVerify = true;
      const res = await this.$axios.$get(`${this.baseURL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      this.verifyReqId = res.reqId;
    },

    async verifyLast() {
      const res = await this.$axios.$post(
        `${this.baseURL}/auth/verify`,
        {
          reqId: this.verifyReqId,
          pin: this.pin,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );
      this.pendingVerify = false;
    },

    setCookie(cname: string, cvalue: string, exdays: number) {
      const d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      const expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    },

    getCookie(cname: string) {
      const name = cname + '=';
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return '';
    },

    async submit(e: Event) {
      e.preventDefault();
      window.scrollTo(0, 0);
      this.errors = [];

      if (!this.body.name) {
        this.errors.push('لطفا نام را وارد کنید');
      } else if (!this.body.familyName) {
        this.errors.push('لطفا نام خانوادگی را وارد کنید');
      } else if (!this.body.studentNumber) {
        this.errors.push('لطفا شماره دانشجویی را وارد کنید');
      } else if (!this.body.nationalCode) {
        this.errors.push('لطفا کد ملی را وارد کنید');
      } else if (!this.body.phoneNumber) {
        this.errors.push('لطفا شماره تماس را وارد کنید');
      } else {
        const res = this.$axios.post(
          `${this.baseURL}/auth`,
          {
            ...this.body,
          },
        );
        this.pending = true;
        try {
          this.accessToken = (await res).data.access_token;
          this.pending = false;
          document.cookie = `access_token=${this.accessToken}`;
          this.setCookie('access_token', this.accessToken, 15);
          this.fetch();
        } catch (error: any) {
          this.errors.push(this.errors.push(error.message));
        }
      }
    },
  },
});
</script>

<style lang="postcss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap');

html {
  font-family: 'Vazirmatn', sans-serif;
}

input {
  outline: none;
  @apply inline-block bg-gray-100 border-2 rounded-lg px-3 py-1 my-2 font-semibold text-gray-700;
  &:hover {
    @apply bg-gray-200;
  }
  &:focus {
    @apply bg-gray-200;
  }
}

h2 {
  @apply text-xl font-medium mt-10;
}

.activity-records {
  width: 100%;
}

li {
  @apply w-60 h-16 text-center;
  min-width: 10rem;
}

ul {
  @apply flex flex-row text-lg font-medium;
}

.middle-ul > li {
  border-top: 0;
}

li > input {
  @apply block border-0 px-0 py-0 my-0 text-center text-black rounded-none h-full w-full;
}

textarea {
  @apply my-2 p-4 bg-gray-200 rounded-lg text-black;
  width: 100%;
  outline: none;
}

button {
  @apply bg-blue-300;
  transition: 0.5s ease all;
  &:hover {
    @apply bg-blue-500;
  }
}
button:disabled {
  @apply bg-blue-100;
}

template > * {
  @apply p-1 m-2 sm:m-10 mx-2 sm:mx-20 flex flex-col items-start;
}
</style>
