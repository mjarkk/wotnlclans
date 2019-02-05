package server

import (
	"strings"

	"github.com/mjarkk/wotnlclans/discord"

	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/db"
)

// serveDataRoutes serves the data routes
func serveDataRoutes(r *gin.Engine) {
	r.GET("/clanData", func(c *gin.Context) {
		data, err := db.GetCurrentClansTop(50)
		if err != nil {
			c.JSON(400, gin.H{
				"status": false,
				"err":    err.Error(),
			})
			return
		}
		for id := range data {
			data[id].Description = ""
		}
		c.JSON(200, gin.H{
			"status": true,
			"data":   data,
		})
	})
	r.GET("/search/:query/:sortOn", func(c *gin.Context) {
		query := c.Param("query")
		sortOn := c.Param("sortOn")
		if len(query) < 1 {
			c.JSON(200, map[string]interface{}{
				"status": false,
				"error":  "the query param must be longer than 1 caracter \"/search/:query/:sortOn\"",
			})
			return
		}

		list, err := db.SearchClans(query, sortOn)
		if returnIfErr(c, err, "Failed to search for clans using query: "+query+", and sorting on: "+sortOn) {
			return
		}

		c.JSON(200, map[string]interface{}{
			"status": true,
			"data":   list,
		})
	})
	r.GET("/clanData/:ids", func(c *gin.Context) {
		stats, err := db.GetCurrentClansByID(strings.Split(c.Param("ids"), "+")...)
		if returnIfErr(c, err, "Failed to get clans by ID") {
			return
		}
		for id := range stats {
			stats[id].Description = ""
		}
		c.JSON(200, gin.H{
			"status": true,
			"data":   stats,
		})
	})
	r.GET("/clanIDs/:toGet", func(c *gin.Context) {
		status := true
		hasErr := ""

		toReturn, err := db.LightClanPositions(c.Param("toGet"))
		if err != nil {
			hasErr = err.Error()
			status = false
		}

		c.JSON(200, gin.H{
			"status":  status,
			"data":    toReturn,
			"default": db.CurrentDefaultFiltered(),
			"err":     hasErr,
		})
	})
	r.GET("/clanDescription/:clanID", func(c *gin.Context) {
		stats, err := db.GetCurrentClansByID(c.Param("clanID"))
		if returnIfErr(c, err, "Failed to get clans by ID") {
			return
		}
		if len(stats) < 1 {
			c.JSON(200, map[string]interface{}{
				"status": false,
				"error":  "Clan not found",
			})
			return
		}

		c.JSON(200, gin.H{
			"status": true,
			"data":   stats[0].Description,
		})
	})
	r.GET("/discord", func(c *gin.Context) {
		if discord.IsEnabled {
			c.JSON(200, gin.H{
				"status":     true,
				"enabled":    true,
				"inviteLink": discord.AuthURL,
			})
		} else {
			c.JSON(200, gin.H{
				"status":  true,
				"enabled": false,
			})
		}
	})
}
