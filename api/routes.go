package api

import (
	"errors"
	"strings"

	"github.com/kirinlabs/HttpRequest"
	"github.com/mjarkk/wotnlclans/other"
)

var routePrefix = "https://api.worldoftanks.eu"

// Routes are all the possible routes to make
var Routes = map[string]string{
	"me":                "/wot/account/info/?application_id={{key}}&account_id={{playerID}}&fields=nickname%2Cclan_id",
	"clanIcon":          "/wgn/clans/info/?application_id={{key}}&clan_id={{clan}}&fields=tag%2Ccolor%2Cemblems.x195",
	"playerInfoLogedIn": "/wot/account/info/?application_id={{key}}&account_id={{playerID}}&access_token={{playerAccessToken}}",
	"playerInfo":        "/wot/account/info/?application_id={{key}}&account_id={{playerID}}",
	"loginLink":         "/wot/auth/login/?display=popup&nofollow=1&application_id={{key}}&redirect_uri={{redirectURL}}",
	"topClans":          "/wgn/clans/list/?application_id={{key}}&limit=100&game=wot&fields=clan_id&page_no={{pageNum}}",
	"clanDiscription":   "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&fields=description",
	"clanTag":           "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&fields=tag",
	"clanData":          "/wgn/clans/info/?application_id={{key}}&clan_id={{clanID}}&game=wot",
	"clanRating":        "/wot/clanratings/clans/?application_id={{key}}&clan_id={{ClanID}}",
}

// GetAPIRoute returns a route with the inputs parsed
func GetAPIRoute(what string, inputs map[string]string) (string, error) {
	if _, hasKey := inputs["key"]; !hasKey {
		inputs["key"] = other.Flags.WGKey
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

// Get returns the response data of a url
func Get(uri string) (string, error) {
	req := HttpRequest.NewRequest()
	res, err := req.Get(uri, nil)
	if err != nil {
		return "", nil
	}
	out, err := res.Body()
	if err != nil {
		return "", err
	}
	return string(out), nil
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
func CallRoute(what string, inputs map[string]string) (string, error) {
	url, err := GetAPIRoute(what, inputs)
	if err != nil {
		return "", err
	}
	return Get(url)
}
