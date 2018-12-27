package api

import (
	"bufio"
	"bytes"
	"encoding/json"
	"image"
	"image/draw"
	"image/png" // This needs to be imported because otherwhise image.Decode won't work with png images
	"io/ioutil"
	"os"
	"strings"
	"sync"

	"github.com/disintegration/imaging"
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
			return err
		}
		png.Encode(file, outputImg)
		file.Close()

		file, err = os.Create("./icons/allIcons.json")
		if err != nil {
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
			return err
		}
		return nil
	}

	return nil
}