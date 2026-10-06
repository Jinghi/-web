# 航空数据管控平台前端

基于 Vue 3 + Vite + Element Plus + ECharts，对接 `hangkong` 后端航空数据管控 API。

## 页面

- `/login`：系统登录。默认演示账号 `admin / 123456`。
- `/home`：航空运行数据驾驶舱。包含首页 KPI、航线、机场、航司、扇区、通话饱和度、告警、年度趋势、冲突指令分析。
- `/monitor`：航空实时监控。包含雷达航迹、实时告警、扇区状态、历史航迹查看、管制指令纠错和当前航班列表。

## 联调

开发模式默认将 `/api` 代理到 `http://127.0.0.1:8848`，与后端仓库约定一致。

`.env.development` 中：

```text
VITE_APP_BASE_API=http://localhost:8848/api
VITE_DEMO_FALLBACK=true
```

`VITE_DEMO_FALLBACK=true` 表示后端暂时不可用时使用内置演示数据，让前端页面仍可查看。正式联调或验收时可设为 `false`，让接口错误直接暴露。

## 启动

```bash
npm install
npm run dev
```

默认端口：`8089`

## 主要接口映射

- 首页概览：`GET /api/dashboard/overview`
- 航线：`GET /api/airline/list`、`GET /api/airline/stat`
- 机场：`GET /api/airport/load`
- 航司：`GET /api/company/list`
- 扇区：`GET /api/sector/count`、`GET /api/sector/flow`
- 通话：`GET /api/callsaturation/list`
- 告警：`GET /api/warn/stat`、`GET /api/warn/annual`、`GET /api/warn/tp/analysis`
- 雷达：`GET /api/radar/flight/list`、`GET /api/radar/flight/track`
- 实时监控：`GET /api/monitor/sector/summary`、`GET /api/monitor/warnings`
- 指令纠错：`POST /api/monitor/instruction/check`
- 告警处理：`PUT /api/warn/{warn_type}/{warn_id}/handle`
