package server

import (
	"github.com/gin-gonic/gin"
)

// serveStaticFiles simply servs static files
func serveStaticFiles(r *gin.Engine) {
	r.StaticFile("/", "./web_static/build/index.html")
	r.StaticFile("/icons/json", "./icons/allIcons.json")
	r.StaticFile("/icons/png", "./icons/allIcons.png")
	r.Static("/js", "./web_static/build/js")
}
