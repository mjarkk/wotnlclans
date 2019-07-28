package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/other"
)

// serverPostRoutes are post routes that are to small to make a file for them
func serverPostRoutes(r *gin.Engine) {
	r.POST("/api/checkCommunityBlock", func(c *gin.Context) {
		var data other.CommunityBlock
		err := c.BindJSON(&data)
		if err != nil {
			c.JSON(400, gin.H{
				"status": false,
				"error":  err.Error(),
			})
			return
		}

		c.JSON(200, gin.H{
			"status": true,
			"data": gin.H{
				"errors": data.CheckCommunityBlock(),
			},
		})
	})
}
