package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/db"
)

type typeArrayField struct {
	Type        string      `json:"type"`
	ScreenName  string      `json:"screenname"`
	Discription string      `json:"discription"`
	Clans       interface{} `json:"clans"`
	UpdateURL   string      `json:"updateurl"`
}

func isNotAdmin(c *gin.Context) bool {
	var postData struct {
		UserID  string `json:"userID"`
		UserKey string `json:"userKey"`
	}
	_ = c.ShouldBindJSON(&postData)

	check, user := db.IsLogedIN(postData.UserID, postData.UserKey)
	if !check || !user.IsAdmin() {
		c.JSON(200, map[string]interface{}{
			"status": false,
			"error":  "Woopsie doopsie you don't have the rights to view this page",
		})
		return true
	}
	return false
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

// serverSettings serves all the routes for the settings section in the website
func serveSettings(r *gin.Engine) {
	r.POST("/settings/allData", func(c *gin.Context) {
		if isNotAdmin(c) {
			return
		}

		dbBlockedClans, err := db.GetBlockedClans()
		if returnIfErr(c, err, "can't get blocked clans from database") {
			return
		}

		dbExtraClans, err := db.GetExtraClans()
		if returnIfErr(c, err, "can't get extra clans from database") {
			return
		}

		c.JSON(200, map[string]interface{}{
			"status": true,
			"fields": []interface{}{
				typeArrayField{
					Type:        "array",
					ScreenName:  "Blocked Clans",
					Discription: "Clans that need to be removed from the list",
					Clans:       dbBlockedClans,
					UpdateURL:   "/settings/update/blockedClans",
				},
				typeArrayField{
					Type:        "array",
					ScreenName:  "Extra Clans",
					Discription: "Add here extra clans to fetch",
					Clans:       dbExtraClans,
					UpdateURL:   "/settings/update/extraClans",
				},
			},
		})
	})
	r.POST("/settings/update/blockedClans", func(c *gin.Context) {
		if isNotAdmin(c) {
			return
		}

		var postData struct {
			Clans db.BlockedClans `json:"clans"`
		}
		if c.ShouldBindJSON(&postData) != nil {
			c.JSON(200, map[string]interface{}{
				"status": false,
				"error":  "Post data wrong",
			})
			return
		}

	})
	r.POST("/settings/update/extraClans", func(c *gin.Context) {
		if isNotAdmin(c) {
			return
		}

		var postData struct {
			Clans db.ExtraClans `json:"clans"`
		}
		if c.ShouldBindJSON(&postData) != nil {
			c.JSON(200, map[string]interface{}{
				"status": false,
				"error":  "Post data wrong",
			})
			return
		}

	})
}
