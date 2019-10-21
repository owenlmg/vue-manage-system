module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/admin' : '/',
    productionSourceMap: false,
    devServer: {
        proxy: 'http://localhost'
    }
}
