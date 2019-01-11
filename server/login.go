package server

import (
	"encoding/json"
	"fmt"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/api"
	"github.com/mjarkk/wotnlclans/db"
	"github.com/mjarkk/wotnlclans/other"
)

// setupLogin sets all routes for the login part and for logged in users
func setupLogin(r *gin.Engine) {
	r.GET("/redirectToLogin/:baseURL", func(c *gin.Context) {
		redirectURL, err := url.PathUnescape(c.Param("baseURL") + "/logedIn")
		if err != nil {
			c.String(409, "Error, "+err.Error())
		}
		rawOut, err := api.CallRoute("loginLink", map[string]string{"redirectURL": redirectURL})
		if err != nil {
			c.String(409, "Error, "+err.Error())
		}
		var out api.LoginLink
		json.Unmarshal([]byte(rawOut), &out)

		if out.Status != "ok" {
			c.String(409, "Error, "+out.Error.Message)
		}

		c.Redirect(302, out.Data.Location)
	})
	r.GET("/logedIn", func(c *gin.Context) {
		accountID := c.Query("account_id")
		accessToken := c.Query("access_token")
		nickName := c.Query("nickname")
		// expiresAt := c.Query("expires_at")
		status := c.Query("status")

		user, token, err := api.CheckToken(status, accountID, nickName, accessToken)
		userid := fmt.Sprintf("%v", user.UserID)
		sucess := "false"
		if err == nil {
			sucess = "true"
			c.SetCookie("wotnlclansUserId", userid, 3600*24*30, "/", other.GetDomain(c.GetHeader("Origin")), false, false)
		} else {
			token = ""
			userid = ""
			user.Rights = "user"
		}

		toReturn := fmt.Sprintf(`<!DOCTYPE html>
			<html>
				<body>
					<title>Close popup</title>
				</body>
				<html>
					<script>
						window.opener.closeLoginPopup("%v", "%v", "%v", "%v", function() {window.close()})
					</script>
				</html>
			</html>
		`, token, userid, user.Rights, sucess)

		c.Data(200, "text/html", []byte(toReturn))
	})

	r.POST("/checkUser", func(c *gin.Context) {
		var postData struct {
			UserID  string `json:"userID"`
			UserKey string `json:"userKey"`
		}
		_ = c.ShouldBind(&postData)

		check, user := db.IsLogedIN(postData.UserID, postData.UserKey)

		c.JSON(200, map[string]interface{}{
			"status": check,
			"rights": user.Rights,
		})
	})
}
