package server

import (
	"io/ioutil"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mjarkk/wotnlclans/other"
)

func handleFile(c *gin.Context, file, contentType string) {
	data, err := ioutil.ReadFile(file)
	if err != nil {
		c.Data(404, contentType, []byte(""))
		return
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
}

func serveStaticDir(r *gin.Engine, route, dir, contentType string) {
	if len(dir) == 0 || len(route) == 0 {
		log.Panicln("route and dir needs to have at least 1 caracter")
	}
	if string(dir[len(dir)-1]) != "/" || string(route[len(route)-1]) != "/" {
		log.Panicln("route and dir needs to end with a /")
	}
	r.GET(route+":file", func(c *gin.Context) {
		file := c.Param("file")
		allowed := "qwertyuiopasdfghjklzxcvbnm.1234567890" // a list of allowed crachters
		for _, char := range strings.Split(file, "") {
			if !strings.Contains(allowed, char) {
				c.Data(400, contentType, []byte(""))
				return
			}
		}

		if strings.Contains(file, "..") {
			c.Data(400, contentType, []byte(""))
			return
		}

		handleFile(c, dir+file, contentType)
	})
}

func serveStaticFile(r *gin.Engine, route, file, contentType string) {
	r.GET(route, func(c *gin.Context) {
		handleFile(c, file, contentType)
	})
}

// serveStaticFiles simply servs static files
func serveStaticFiles(r *gin.Engine) {
	r.StaticFile("/", "./web_static/build/index.html")
	serveStaticFile(r, "/icons/webp", "./icons/allIcons.webp", "image/webp")
	serveStaticFile(r, "/icons/json", "./icons/allIcons.json", "application/json")
	serveStaticFile(r, "/icons/png", "./icons/allIcons.png", "image/png")
	serveStaticFile(r, "/manifest.json", "./web_static/manifest.json", "application/json")
	serveStaticDir(r, "/js/", "./web_static/build/js/", "text/javascript")
	r.Static("/logos", "./icons/logos")
}
