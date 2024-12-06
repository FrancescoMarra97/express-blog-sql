const loggerMiddleware = (req, res, next) => {
    const now = new Date().toString();
    console.error(`
        Date: ${now} 
    Method: ${req.method} 
    URL: ${req.url}
        `);

    next()
}

module.exports = loggerMiddleware;