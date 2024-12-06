const express = require('express')
const app = express()
const postsRouter = require('./routes/posts.js')
const notFoundMiddleware = require("./middlewares/notFound.js")
const loggerMiddleware = require('./middlewares/loggerMiddleware')
const PORT = process.env.PORT
const HOST = process.env.HOST
const cors = require('cors');

app.use(cors());
app.use('/posts', loggerMiddleware)
app.use(express.json())
app.use(express.static('public'))
/* app.use('/posts', (req, res, next) => {
	throw new Error("You broke everything dude! 💥");
  });  */
app.use('/posts', postsRouter)

app.listen(PORT, (req, res) => {
	console.log(`Server is running in ${HOST}:${PORT}`)
})
app.use(notFoundMiddleware)
app.use((err, req, res, next) => {
	console.log("Error: ", err.message);
	console.error(err.stack);
	res.status(500).send({
		message: "Something went wrong",
		error: err.message
	})
});
