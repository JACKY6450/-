module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Meteorology-Monthly-Average-Observation/' // 為 repo 名稱
    : '/'
}