package server

import (
	"encoding/json"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/api"
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
		c.Data(200, "text/html", []byte(`<!DOCTYPE html>
		<html>
			<body>
				<title>Close popup</title>
			</body>
			<html>
				<script>
					window.opener.closeLoginPopup(location.search, function() {window.close()})
				</script>
			</html>
		</html>
		`))
	})
}
