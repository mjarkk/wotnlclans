package other

import (
	"crypto/sha1"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"strings"
)

// GetDomain returns the domain of a input string
// Example:
//    domain := other.GetDomain("https://test.somedomain.com/idk")
//    fmt.Println(domain) // -> test.somedomain.com
func GetDomain(input string) string {
	workingOn := input
	if strings.Contains(input, "http://") || strings.Contains(input, "https://") {
		workingOn = strings.Split(input, "//")[1]
	}
	return strings.Split(strings.Split(strings.Split(workingOn, "/")[0], "#")[0], "?")[0]
}

// GetHash returns the sha1 hash of the input
func GetHash(input []byte) string {
	return fmt.Sprintf("%x", sha1.Sum(input))
}

// RemoveQuotes removes quotes from the input
// for some reason the database sometimes returns "" arounds clan ID strings
func RemoveQuotes(input string) string {
	return strings.Replace(input, "\"", "", -1)
}

// RemoveAllQuotes removes quotes from all strings in a list
// for some reason the database sometimes returns "" arounds clan ID strings
func RemoveAllQuotes(input []string) []string {
	for i, item := range input {
		input[i] = RemoveQuotes(item)
	}
	return input
}

// FormatSearch formats a string to make it better for comparing to other things
func FormatSearch(input string) string {
	return strings.ToUpper(
		strings.Replace(
			strings.Replace(
				strings.Replace(
					input,
					"1",
					"i",
					-1,
				),
				"3",
				"e",
				-1,
			),
			"0",
			"o",
			-1,
		),
	)
}

// CommunityBlock contains the data for 1 block on the community tab
type CommunityBlock struct {
	// Text is the title shown
	Text string `json:"text"`

	// Background are the options for the background,
	// There are 3 diffrent options here:
	// 1. Link to the background image with no background text nor color
	// 2. background text with background color
	// 3. Only Color
	Background struct {
		Text  string `json:"text"`
		Color string `json:"color"`
		Image string `json:"image"`
	} `json:"background"`

	// Link is the data for the link at the right bottom
	// if both of these are empty the link button won't be shown
	Link struct {
		URL  string `json:"url"`
		Text string `json:"text"`
	} `json:"link"`

	// Info can be set if you want to show the I button with
	// The frontend will transform this to markdown
	// If empty this will be hidden
	Info string `json:"info"`

	// Requirements is a list of requirements/block tags
	// these can be used for hiding a block if they are added
	//
	// Supported:
	// - "discord" (the discord token needs to be available)
	Requirements []string `json:"requirements"`
}

var cachedCommunityData []CommunityBlock

// GetCommunityData returns the CommunityBlocks
func GetCommunityData() []CommunityBlock {
	if cachedCommunityData != nil {
		return cachedCommunityData
	}

	data, err := ioutil.ReadFile("./community.json")
	if err != nil {
		fmt.Println("ERROR: Can't read community.json,", err)
		cachedCommunityData = []CommunityBlock{}
		return cachedCommunityData
	}

	err = json.Unmarshal(data, &cachedCommunityData)
	if err != nil {
		cachedCommunityData = []CommunityBlock{}
		return cachedCommunityData
	}

	return cachedCommunityData
}

// CheckCommunityBlock checks a communityblock and returns in a slice the errors if found
func (block *CommunityBlock) CheckCommunityBlock() []string {
	foundErrors := []string{}
	addErr := func(err string) {
		foundErrors = append(foundErrors, err)
	}

	bgColor := block.Background.Color
	bgImage := block.Background.Image
	if len(bgImage) > 0 {
		if !strings.HasPrefix(bgImage, "https://") {
			addErr("A background image must start with https:// not http:// nor some.url.com")
		}
		if len(bgImage) > 100 {
			addErr("The background images url can't contain more than 100 characters")
		}
	} else if len(bgColor) > 0 {
		checkColor := func(c string) error {
			c = string(c[1:])
			if len(c) != 3 && len(c) != 6 {
				return errors.New("not a valid hex color")
			}
			toReplace := strings.Split("1234567890abcdefABCDEF", "")
			for _, item := range toReplace {
				c = strings.Replace(c, item, "", -1)
			}
			if len(c) > 0 {
				return errors.New("not a valid hex color")
			}
			return nil
		}
		if !strings.HasPrefix(bgColor, "#") || checkColor(bgColor) != nil {
			addErr("a background color must be a valid hex color like #000000 or #a1b2c3")
		}
	} else {
		addErr("You must have a background color or image")
	}

	bgText := block.Background.Text
	if len(bgText) > 16 {
		addErr("The background text can't contain more than 16 characters")
	}

	linkText := block.Link.Text
	if len(linkText) > 15 {
		addErr("The link text can't contain more than 15 characters")
	}

	linkURL := block.Link.URL
	if linkURL != "" {
		if !strings.HasPrefix(linkURL, "https://") {
			addErr("A background image must start with https:// not http:// nor some.url.com")
		}
		if len(linkURL) > 100 {
			addErr("The background images url can't contain more than 100 characters")
		}
	}

	if len(block.Requirements) > 0 {
		addErr("Invalid requirements")
	}

	if len(block.Text) > 60 {
		addErr("The title can't contain more than 60 characters")
	}

	if len(block.Text) > 60 {
		addErr("The title can't contain more than 60 characters")
	}

	if len(block.Info) > 1700 {
		addErr("The info can't contain more than 60 characters")
	}
	if strings.Contains(block.Info, "javascript:") || strings.Contains(block.Info, "data:") {
		addErr("The info can't contain `javascript:` or `data:`")
	}

	return foundErrors
}
