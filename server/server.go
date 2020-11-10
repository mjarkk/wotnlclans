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

	serveDataRoutes(r)
	serverPostRoutes(r)
	serveStaticFiles(r)

	return r
}

func returnIfErr(c *gin.Context, err error, message string) bool {
	if err != nil {
		c.JSON(200, map[string]interface{}{
			"status": false,
			"error":  message,
		})
		return true
	}
	return false
}
