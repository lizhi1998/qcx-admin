import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/login'
import error from '@/views/error/404'

import AdminHome from '@/views/admin/index'
import AdminHomePage from '@/views/admin/home/index'
import PasswordReset from '@/views/admin/home/password'
import Respassword from '@/views/admin/home/respassword'
import StudentAdd from '@/views/admin/student/add'
import StudentFree from '@/views/admin/student/free'
import SingleHandle from '@/views/admin/student/single'
import BatchHandle from '@/views/admin/student/batch'
import ScoreApply from '@/views/admin/info/apply'
import ScoreAppeal from '@/views/admin/info/appeal'
import DataReset from '@/views/admin/resource/dataReset'
import OpLogExport from '@/views/admin/resource/operationLog'
import StuLogExport from '@/views/admin/resource/studentLog'
import UserCharge from '@/views/admin/user/index'
import InspectionAdd from '@/views/admin/inspect/add'
import InspectionSubmitted from '@/views/admin/inspect/submitted'
import InspectionPending from '@/views/admin/inspect/pending'
import testStu from '@/views/admin/stu/index'
import { join } from 'path'

Vue.use(Router);

const router = new Router({
  mode: 'history', //不修改的话，默认为hash，地址会出现/#/
  base: "/admin",
  routes:
    // 默认重定向到登录页
    [{
      path: '/admin',
      redirect: '/login',
      component: login,
      name: 'login'
    },
    {
      path: '/login',
      component: login,
      name: 'login'
    },
    {
      path: '*',
      name: '404',
      component: error
    },
    {
      name: '管理系统',
      path: '/admin',
      redirect: '/admin/home',
      component: AdminHome,
      children: [{
        path: 'home',
        component: AdminHomePage,
        name: '概要',
        meta: {
          requireAuth: true,
          isAdmin: true
        }
      },
      {
        path: 'password',
        component: PasswordReset,
        name: '密码重置',
        meta: {
          requireAuth: true,
          isAdmin: true
        }
      },
      {
        path: 'respassword',
        component: Respassword,
        name: '重置密码',
        meta: {
          requireAuth: true,
          isAdmin: true
        }
      },
      {
        name: '学生事务',
        path: '/admin/transaction',
        redirect: '/admin/transaction/single',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [
          {
            path: 'new',
            component: testStu,
            name: '全新体验',
            meta: {
              requireAuth: true,
              isAdmin: true
            }
          },
          {
            path: 'single',
            component: SingleHandle,
            name: '单个操作',
            meta: {
              requireAuth: true,
              isAdmin: true
            }
          },
          {
            path: 'batch',
            component: BatchHandle,
            name: '批量操作',
            meta: {
              requireAuth: true,
              isAdmin: true
            }
          },
          {
            path: 'add',
            component: StudentAdd,
            name: '添加学生',
            meta: {
              requireAuth: true,
              isAdmin: true
            }
          },
          {
            path: 'free',
            component: StudentFree,
            name: '无专业学生处理',
            meta: {
              requireAuth: true,
              isAdmin: true
            }
          }
        ]
      },
      {
        path: '/admin/info',
        redirect: '/admin/info/appeal',
        name: '消息',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [{
          path: 'appeal',
          component: ScoreAppeal,
          name: '申诉',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'apply',
          component: ScoreApply,
          name: '加分申报',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        }
        ]
      },
      {
        name: '数据管理',
        path: '/admin/resource',
        redirect: '/admin/resource/studentLog',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [{
          path: 'dataReset',
          component: DataReset,
          name: '数据重置',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'studentLog',
          component: StuLogExport,
          name: '学生记录导出',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'operationLog',
          component: OpLogExport,
          name: '操作日志导出',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        }
        ]
      },
      {
        name: '用户管理',
        path: '/admin/manage',
        redirect: '/admin/manage/charge',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [{
          path: 'charge',
          component: UserCharge,
          name: '更新带班表',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        }]
      },
      {
        name: '巡查',
        path: '/admin/inspect',
        redirect: '/admin/inspect/add',
        component: {
          render(c) {
            return c('router-view')
          }
        },
        children: [{
          path: 'add',
          component: InspectionAdd,
          name: '发起巡查',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'submitted',
          component: InspectionSubmitted,
          name: '提交记录查看',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'pending',
          component: InspectionPending,
          name: '待处理巡查',
          meta: {
            requireAuth: true,
            isAdmin: true
          }
        }
        ]
      }
      ]
    }
    ]
})

//未登录过滤路由
router.beforeEach((to, from, next) => {
  next();
  // if (to.matched.some(item => item.meta.requireAuth)) {
  //   next()
  // } else {
  //   next({
  //     path: '/admin'
  //   })
  // }
})

export default router
