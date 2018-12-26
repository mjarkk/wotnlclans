package api

import (
	"bytes"
	"image"
	_ "image/png" // This needs to be imported because otherwhise image.Decode won't work
	"io/ioutil"
	"os"
	"strings"
	"sync"

	"github.com/mjarkk/wotnlclans/db"
)

type imageAndIDType struct {
	ID    string
	Image image.Image
}

// GetIcons fetches all clan icons and creates a grid
func GetIcons() error {
	clans, err := db.GetCurrentClansData()
	if err != nil {
		return err
	}
	toSavePath := "./icons/clanIcons"
	os.RemoveAll(toSavePath)
	os.Mkdir(toSavePath, os.ModePerm)
	imgAndID := []imageAndIDType{}

	var waitForImgs sync.WaitGroup
	waitForImgs.Add(len(clans))

	for _, clan := range clans {
		go func(clan db.ClanStats) {
			iconToGet, ok := clan.Emblems["X195.Portal"]
			if !ok {
				iconToGet, ok = clan.Emblems["X256.Wowp"]
				if !ok {
					return
				}
			}
			if !strings.Contains(iconToGet, "http://") && !strings.Contains(iconToGet, "https://") {
				return
			}
			out, err := RawGet(iconToGet)
			if err != nil {
				return
			}
			uriDots := strings.Split(iconToGet, ".")
			fileExt := uriDots[len(uriDots)-1]
			imgPath := toSavePath + "/" + clan.ID + "." + fileExt
			err = ioutil.WriteFile(imgPath, out, 0644)
			if err != nil {
				return
			}

			img, _, err := image.Decode(bytes.NewReader(out))
			if err != nil {
				return
			}

			imgAndID = append(imgAndID, imageAndIDType{
				ID:    clan.ID,
				Image: img,
			})
			waitForImgs.Done()
		}(clan)
	}

	waitForImgs.Wait()

	// if len(imgAndID) > 0 {
	// 	// icons := [][]string{}
	// 	for _, imageObj := range imgAndID {
	// 		id := imageObj.ID
	// 		img := imageObj.Image

	// 		offset := image.Point{img.Bounds().Dx(), 0}
	// 		toInsert := image.Rectangle{offset, offset.Add(img.Bounds().Size())}

	// 		canvas := image.NewRGBA(image.Rectangle{image.Point{0, 0}, toInsert.Max})

	// 		draw.Draw(canvas, img.Bounds(), img, image.Point{0, 0}, draw.Src)
	// 		draw.Draw(canvas, toInsert, img, image.Point{0, 0}, draw.Src)

	// 		// image := imageObj.Image
	// 		fmt.Println(id)
	// 	}
	// }

	return nil
}
