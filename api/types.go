package api

// TopClans is a structure for the tops clans route
type TopClans struct {
	Data []struct {
		ClanID string `json:"clan_id"`
	} `json:"data"`
	Error struct {
		Code    int    `json:"code"`
		Field   string `json:"field"`
		Message string `json:"message"`
		Value   string `json:"value"`
	} `json:"error"`
	Meta struct {
		Count int `json:"count"`
		Total int `json:"total"`
	} `json:"meta"`
	Status string `json:"status"`
}
