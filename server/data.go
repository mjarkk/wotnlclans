package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/db"
)

// dataRes is the content type that will be send to a user
type dataRes struct {
	data     interface{}
	hasError bool
	err      string
}

// serveDataRoutes serves the data routes
func serveDataRoutes(r *gin.Engine) {
	r.GET("/clanData", func(c *gin.Context) {
		res := dataRes{
			hasError: true,
			err:      "",
			data:     map[string]string{},
		}

		data, err := db.GetCurrentClansData()
		c.Request.Close = true
		if err != nil {
			res.err = err.Error()
			c.JSON(400, res)
			return
		}

		res.hasError = false
		res.data = data
		c.JSON(200, res)
	})
}
