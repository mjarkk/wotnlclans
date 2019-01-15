package server

import (
	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/api"
	"github.com/mjarkk/wotnlclans/db"
)

type typeArrayField struct {
	Type        string      `json:"type"`
	ScreenName  string      `json:"screenname"`
	Discription string      `json:"discription"`
	Clans       interface{} `json:"clans"`
	UpdateURL   string      `json:"updateurl"`
}

// isNotAdmin checks returns false if there are no valid keys for a admin found in the post data
// Use selfGetUser if you want to use the post data
func isNotAdmin(c *gin.Context, selfGetUser ...func() (userID, userKEY string)) bool {
	var postData struct {
		UserID  string `json:"userID"`
		UserKey string `json:"userKey"`
	}
	userID := ""
	userKEY := ""

	if len(selfGetUser) > 0 {
		userID, userKEY = selfGetUser[0]()
	} else {
		_ = c.ShouldBindJSON(&postData)
		userID = postData.UserID
		userKEY = postData.UserKey
	}

	check, user := db.IsLogedIN(userID, userKEY)
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

// SendAndUpdateList sends a json true status to the client and updates the clan list
func SendAndUpdateList(c *gin.Context) {
	res := map[string]interface{}{
		"status": true,
	}

	if !api.UpdateIfPossible() {
		res["humanMeta"] = "Api is currently buzzy"
		res["meta"] = "API_BUZZY"
	}

	c.JSON(200, res)
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
		var postData db.PostBlockedClans

		if isNotAdmin(c, func() (string, string) {
			_ = c.ShouldBindJSON(&postData)
			return postData.UserID, postData.UserKey
		}) {
			return
		}

		if returnIfErr(c, postData.Clans.UpdateInDB(), "Can't insert clan ids") {
			return
		}

		SendAndUpdateList(c)
	})
	r.POST("/settings/update/extraClans", func(c *gin.Context) {
		var postData db.PostExtraClans

		if isNotAdmin(c, func() (string, string) {
			_ = c.ShouldBindJSON(&postData)
			return postData.UserID, postData.UserKey
		}) {
			return
		}

		if returnIfErr(c, postData.Clans.UpdateInDB(), "Can't insert clan ids") {
			return
		}

		SendAndUpdateList(c)
	})
}
