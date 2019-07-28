package server

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

// SetupRouter sets up the gin routes and all the other things gin depends on
func SetupRouter() *gin.Engine {
	fmt.Println("Setting up the webserver...")
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	setupLogin(r)
	serveDataRoutes(r)
	serverPostRoutes(r)
	serveStaticFiles(r)
	serveSettings(r)

	return r
}
