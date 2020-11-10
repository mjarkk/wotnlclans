package api

import (
	"errors"
	"strings"

	"github.com/mjarkk/HttpRequest"
)

var routePrefix = "https://api.worldoftanks.eu"

// Routes are all the possible routes to make
var Routes = map[string]string{
	"nicknameAndClan":   "/wot/account/info/?application_id={{key}}&account_id={{playerID}}&fields=nickname%2Cclan_id",
	"clanIcon":          "/wgn/clans/info/?application_id={{key}}&clan_id={{clan}}&fields=tag%2Ccolor%2Cemblems.x195",
	"playerInfoLogedIn": "/wot/account/info/?application_id={{key}}&account_id={{playerID}}&access_token={{playerAccessToken}}",
	"playerInfo":        "/wot/account/info/?application_id={{key}}&account_id={{playerID}}",
	"topClans":          "/wgn/clans/list/?application_id={{key}}&limit=100&game=wot&fields=clan_id&page_no={{pageNum}}",
	"clanDiscription":   "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&fields=description%2Ctag",
	"clanTag":           "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&fields=tag",
	"clanData":          "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&game=wot",
	"clanRating":        "/wot/clanratings/clans/?application_id={{key}}&clan_id={{clanID}}",
}

// GetAPIRoute returns a route with the inputs parsed
func GetAPIRoute(what string, inputs map[string]string, key string) (string, error) {
	if _, hasKey := inputs["key"]; !hasKey {
		inputs["key"] = key
	}
	selectedRoute, check := Routes[what]
	if !check {
		return "", errors.New("Api route not found")
	}
	for id, value := range inputs {
		selectedRoute = strings.Replace(selectedRoute, "{{"+id+"}}", value, -1)
	}
	if strings.Contains(selectedRoute, "{{") || strings.Contains(selectedRoute, "}}") {
		return "", errors.New("Not all inputs are replaced")
	}
	return routePrefix + selectedRoute, nil
}

// Get returns the response data (string) of a url
func Get(uri string) (string, error) {
	out, err := RawGet(uri)
	if err != nil {
		return "", err
	}
	return string(out), nil
}

// RawGet retruns the literal response data (byte data) of a response
func RawGet(uri string) ([]byte, error) {
	req := HttpRequest.NewRequest()
	res, err := req.Get(uri, nil)
	if err != nil {
		return []byte{}, err
	}
	out, err := res.Body()
	return out, err
}

// Post returns the data of a post request to a url
func Post(uri string, postData map[string]interface{}) (string, error) {
	req := HttpRequest.NewRequest()
	res, err := req.Post(uri, postData)
	if err != nil {
		return "", err
	}
	out, err := res.Body()
	if err != nil {
		return "", err
	}
	return string(out), nil
}

// CallRoute makes a network request
func CallRoute(what string, inputs map[string]string, key string) (string, error) {
	url, err := GetAPIRoute(what, inputs, key)
	if err != nil {
		return "", err
	}
	return Get(url)
}
