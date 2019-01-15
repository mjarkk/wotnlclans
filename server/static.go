package server

import (
	"io/ioutil"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/other"
)

func serveStaticFile(r *gin.Engine, route, file string, contentType string) {
	r.GET(route, func(c *gin.Context) {
		data, err := ioutil.ReadFile(file)
		if err != nil {
			c.Error(err)
		}
		clientHash := strings.Replace(strings.Replace(c.GetHeader("If-None-Match"), "\"", "", -1), "W/", "", -1)
		fileHash := other.GetHash(data)
		c.Header("ETag", "\""+fileHash+"\"")
		resCode := 200

		// fmt.Println(clientHash, fileHash)
		if clientHash == fileHash {
			resCode = 304
		}
		c.Data(resCode, contentType, data)
	})
}

// serveStaticFiles simply servs static files
func serveStaticFiles(r *gin.Engine) {
	r.StaticFile("/", "./web_static/build/index.html")
	serveStaticFile(r, "/icons/webp", "./icons/allIcons.webp", "image/webp")
	serveStaticFile(r, "/icons/json", "./icons/allIcons.json", "image/png")
	serveStaticFile(r, "/icons/png", "./icons/allIcons.png", "application/json")
	r.Static("/js", "./web_static/build/js")
}
