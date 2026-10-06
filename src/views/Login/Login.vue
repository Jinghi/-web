<template>
  <div class="login">
    <div class="top_logo"></div>
    <!-- 登录框区域 -->
    <div class="form_box">
      <div style="color: #f0f0f0; font-size: 24px; font-weight: bold;">航空数据管控平台</div>
      <div style="color:#89a4c1;font-size:12px;margin-top:10px;">演示账号：admin / user / guest，密码均为 123456（权限不同）</div>
      <el-form
        style="margin-top: 60px"
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginFormRef"
      >
        <el-row justify="start" :gutter="20">
          <el-col :span="3" class="flex-center">
            <img src="../../assets/images/user-icon.png" style="margin-top: 3px" alt="user" />
          </el-col>
          <el-col :span="21">
            <el-form-item prop="account">
              <el-input
                class="el-input__inner1"
                v-model="loginForm.account"
                placeholder="请输入用户名"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="tableTitle" />
        </el-row>
        <el-row justify="start" style="margin-top: 50px" :gutter="20">
          <el-col :span="3" class="flex-center">
            <img src="../../assets/images/pwd-icon.png" style="margin-top: 3px" alt="password" />
          </el-col>
          <el-col :span="21">
            <el-form-item prop="password">
              <el-input
                type="password"
                show-password
                v-model="loginForm.password"
                placeholder="请输入密码"
                maxlength="16"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div class="tableTitle" />
        </el-row>
        <el-form-item style="margin-top: 100px">
          <el-button class="el-button1" type="primary" @click="submitForm">
            进入管控平台
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useAuthStore } from '@/store'
import { login } from '@/api/login/login'
import message from '@/utils/message'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()

const loginFormRef = ref(null)
const loginForm = reactive({
  account: '',
  password: ''
})

const rules = {
  account: [{ required: true, message: '请输入登陆账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登陆密码', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = await login(loginForm)
        if (data && data.successful) {
          const rv = data.resultValue || {}
          if (rv.Authorization != null) {
            localStorage.setItem('Authorization', rv.Authorization)
            userStore.changeLogin(rv.Authorization)
          }
          // 保存权限编码/角色（真实后端与演示登录返回结构一致）
          authStore.setLogin(rv)
          // 跳回来源页（路由守卫会再次校验该页权限，无权限则落到首个可访问菜单）
          const fallback = authStore.firstMenuPath() || '/home'
          const redirect = route.query.redirect && typeof route.query.redirect === 'string'
            ? route.query.redirect
            : fallback
          const otherQuery = { ...route.query }
          delete otherQuery.redirect
          router.push({ path: redirect, query: otherQuery })
        } else {
          message.error(data?.message || '登录失败')
        }
      } catch (err) {
        // 异常已由拦截器处理
      }
    }
  })
}
</script>

<style scoped>
.login {
  background: url('../../assets/images/loginBg.png') no-repeat center center;
  background-size: cover;
  height: 100%;
}
.top_logo {
  height: 130px;
}
.form_box {
  text-align: center;
  width: 550px;
  margin: 0 auto;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-button1 {
  background: #0376bf;
  border-color: #0376bf;
  width: 100%;
  color: #f0f0f0;
  height: 62px;
  font-size: 18px;
}
.tableTitle {
  margin: 0 auto;
  margin-top: 10px;
  width: 550px;
  height: 1px;
  background-color: #d4d4d4;
}

:deep(.el-form-item) {
  margin-bottom: 1px;
}
:deep(.el-form-item__error) {
  margin-left: 15px;
  margin-top: 20px;
}
:deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
}
:deep(.el-input__inner) {
  background: transparent !important;
  border: 0 !important;
  color: #f0f0f0 !important;
}
</style>