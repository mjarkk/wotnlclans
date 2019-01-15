package api

import (
	"bufio"
	"bytes"
	"encoding/json"
	"errors"
	"image"
	"image/draw"
	"image/png" // This needs to be imported because otherwhise image.Decode won't work with png images
	"os"
	"strings"
	"sync"

	"github.com/disintegration/imaging"
	webpbin "github.com/mjarkk/go-webpbin"
	"github.com/mjarkk/wotnlclans/db"
	"github.com/mjarkk/wotnlclans/other"
)

type imageAndIDType struct {
	ID    string
	Image image.Image
}

// GetIcons fetches all clan icons and creates a grid
func GetIcons() error {
	other.DevPrint("Getting clan icons...")
	clans, err := db.GetCurrentClansData()
	if err != nil {
		return err
	}
	// toSavePath := "./icons/clanIcons"
	// os.RemoveAll(toSavePath)
	// os.Mkdir(toSavePath, os.ModePerm)
	imgAndID := []imageAndIDType{}

	var waitForImgs sync.WaitGroup
	waitForImgs.Add(len(clans))

	for _, clan := range clans {
		go func(clan db.ClanStats) {
			iconToGet, ok := clan.Emblems["X195.Portal"]
			if !ok || len(iconToGet) == 0 {
				iconToGet, ok = clan.Emblems["X256.Wowp"]
				if !ok || len(iconToGet) == 0 {
					apiErr("GetIcons", errors.New("no X195.Portal and/or X256.Wowp"), "Check if clan has a clan icon")
					return
				}
			}
			if !strings.Contains(iconToGet, "http://") && !strings.Contains(iconToGet, "https://") {
				apiErr("GetIcons", errors.New("image is not a valid url"), "Check if the image url contains http(s)// : "+iconToGet)
				return
			}
			out, err := RawGet(iconToGet)
			if err != nil {
				apiErr("GetIcons", err, "Can't fetch image: "+iconToGet)
				return
			}

			// uriDots := strings.Split(iconToGet, ".")
			// fileExt := uriDots[len(uriDots)-1]
			// imgPath := toSavePath + "/" + clan.ID + "." + fileExt
			// err = ioutil.WriteFile(imgPath, out, 0644)
			// if err != nil {
			// 	return
			// }

			img, _, err := image.Decode(bytes.NewReader(out))
			if err != nil {
				apiErr("GetIcons", err, "Can't decode image: "+iconToGet)
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

	if len(imgAndID) > 0 {
		imgSize := 60
		imgsInARow := 30

		ids := [][]string{[]string{}}
		outputImg := image.NewRGBA(image.Rectangle{image.Point{0, 0}, image.Point{0, 0}})

		for _, imgObj := range imgAndID {

			id := imgObj.ID
			if len(ids[len(ids)-1]) == imgsInARow {
				ids = append(ids, []string{})
			}
			from := struct {
				top  int
				side int
			}{
				top:  len(ids),
				side: len(ids[len(ids)-1]),
			}

			insertImg := imaging.Resize(imgObj.Image, imgSize, imgSize, imaging.Lanczos)
			offset := image.Point{imgSize * from.side, imgSize * (from.top - 1)}
			whereToInsert := image.Rectangle{offset, offset.Add(insertImg.Bounds().Size())}
			maxSize := image.Point{(len(ids[0]) + 1) * imgSize, len(ids) * imgSize}

			canvas := image.NewRGBA(image.Rectangle{image.Point{0, 0}, maxSize})
			draw.Draw(canvas, outputImg.Bounds(), outputImg, image.Point{0, 0}, draw.Src)
			draw.Draw(canvas, whereToInsert, insertImg, image.Point{0, 0}, draw.Src)
			outputImg = canvas

			ids[len(ids)-1] = append(ids[len(ids)-1], id)
		}

		file, err := os.Create("./icons/allIcons.png")
		if err != nil {
			apiErr("GetIcons", err, "Can't create allIcons.png")
			return err
		}
		png.Encode(file, outputImg)
		file.Close()

		err = webpbin.NewCWebP().
			Quality(50).
			InputFile("./icons/allIcons.png").
			OutputFile("./icons/allIcons.webp").
			Run()
		if err != nil {
			apiErr("GetIcons", err, "Can't create allIcons.webp")
			return err
		}

		file, err = os.Create("./icons/allIcons.json")
		if err != nil {
			apiErr("GetIcons", err, "Can't create allIcons.json")
			return err
		}
		writer := bufio.NewWriter(file)

		defer func() {
			writer.Flush()
			file.Close()
		}()

		jsonEncoder := json.NewEncoder(writer)
		err = jsonEncoder.Encode(ids)
		if err != nil {
			apiErr("GetIcons", err, "Can't encode config into json")
			return err
		}
	}

	return nil
}
