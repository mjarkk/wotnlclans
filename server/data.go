package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/db"
)

// serveDataRoutes serves the data routes
func serveDataRoutes(r *gin.Engine) {
	r.GET("/clanData", func(c *gin.Context) {
		data, err := db.GetCurrentClansTop(50)
		c.Request.Close = true
		if err != nil {
			c.JSON(400, gin.H{
				"status": false,
				"err":    err.Error(),
			})
			return
		}
		c.JSON(200, gin.H{
			"status": true,
			"data":   data,
		})
	})
	r.GET("/clanData/:ids", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": true,
		})
	})
	r.GET("/clanIDs/:toGet", func(c *gin.Context) {
		status := true
		hasErr := ""

		itemToGet := c.Param("toGet")

		data := db.SortedRating

		toReturn := map[string]interface{}{}

		if itemToGet == "all" {
			toReturn["actualData"] = map[string][]int{}
			for clanID, clan := range data {
				toReturn["actualData"].(map[string][]int)[clanID] = []int{
					clan.Members,
					clan.Battles,
					clan.Dailybattles,
					clan.Efficiency,
					clan.Fbelo10,
					clan.Fbelo8,
					clan.Fbelo6,
					clan.Fbelo,
					clan.Gmelo10,
					clan.Gmelo8,
					clan.Gmelo8,
					clan.Gmelo,
					clan.Global,
					clan.GlobalWeighted,
					clan.Winratio,
					clan.V10l,
				}
			}
			toReturn["dataMapping"] = []string{
				"members",
				"battles",
				"dailybattles",
				"efficiency",
				"fbelo10",
				"fbelo8",
				"fbelo6",
				"fbelo",
				"gmelo10",
				"gmelo8",
				"gmelo6",
				"gmelo",
				"globrating",
				"globRatingweighted",
				"winratio",
				"v10l",
			}
		} else {
			toReturn["actualData"] = map[string]int{}
			for clanID, clan := range data {
				switch itemToGet {
				case "members":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Members
				case "battles":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Battles
				case "dailybattles":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Dailybattles
				case "efficiency":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Efficiency
				case "fbelo10":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo10
				case "fbelo8":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo8
				case "fbelo6":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo6
				case "fbelo":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo
				case "gmelo10":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo10
				case "gmelo8":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo8
				case "gmelo6":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo6
				case "gmelo":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo
				case "globrating":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Global
				case "globRatingweighted":
					toReturn["actualData"].(map[string]int)[clanID] = clan.GlobalWeighted
				case "winratio":
					toReturn["actualData"].(map[string]int)[clanID] = clan.Winratio
				case "v10l":
					toReturn["actualData"].(map[string]int)[clanID] = clan.V10l
				default:
					status = false
					hasErr = "\"" + itemToGet + "\" can't be filterd on"
				}
			}
		}

		c.JSON(200, gin.H{
			"status": status,
			"data":   toReturn,
			"err":    hasErr,
		})
	})
}
