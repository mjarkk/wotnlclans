package server

import (
	"github.com/gin-gonic/gin"
)

// serveStaticFiles simply servs static files
func serveStaticFiles(r *gin.Engine) {
	r.StaticFile("/", "./web_static/build/index.html")
	r.Static("/js", "./web_static/build/js")
}
