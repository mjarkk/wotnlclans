package other

import (
	"fmt"
	"os"
	"path"
	"path/filepath"
)

// BuildWebStatic builds the web_static js files
func BuildWebStatic() {
	flags := GetFlags()
	if flags.SkipBuild {
		return
	}

	fmt.Println("Setting up the web_static files")
	cmd := "npm run build"
	if flags.Dev {
		cmd = "npm run watch"
	}

	ex, err := os.Executable()
	if err != nil {
		return
	}

	currPath := filepath.Dir(ex)

	webStaticFolder := path.Join(currPath, "web_static")

	go func() {
		_ = Run(cmd, webStaticFolder)
	}()

}
