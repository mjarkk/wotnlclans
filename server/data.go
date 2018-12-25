package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/db"
)

// serveDataRoutes serves the data routes
func serveDataRoutes(r *gin.Engine) {
	r.GET("/clanData", func(c *gin.Context) {
		data, err := db.GetCurrentClansData()
		if err != nil {
			c.JSON(400, nil)
		}
		c.JSON(200, data)
	})
}
