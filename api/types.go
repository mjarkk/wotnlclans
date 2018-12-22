package api

// TopClans is a structure for the tops clans route
type TopClans struct {
	Status string `json:"status"`
	Error  struct {
		Code    int    `json:"code"`
		Field   string `json:"field"`
		Message string `json:"message"`
		Value   string `json:"value"`
	} `json:"error"`
	Meta struct {
		Count int `json:"count"`
		Total int `json:"total"`
	} `json:"meta"`
	Data []struct {
		ClanID uint32 `json:"clan_id"`
	} `json:"data"`
}

// NicknameAndClan is the type for the nicknameAndClan route
type NicknameAndClan struct {
	Error struct {
		Code    int    `json:"code"`
		Field   string `json:"field"`
		Message string `json:"message"`
		Value   string `json:"value"`
	} `json:"error"`
	Meta struct {
		Count int `json:"count"`
	} `json:"meta"`
	Data map[string]struct {
		ClanID   string `json:"clan_id"`
		NickName string `json:"nickname"`
	} `json:"data"`
	Status string `json:"status"`
}

// ClanDiscription is the type for the clanDiscription route
type ClanDiscription struct {
	Error struct {
		Code    int    `json:"code"`
		Field   string `json:"field"`
		Message string `json:"message"`
		Value   string `json:"value"`
	} `json:"error"`
	Meta struct {
		Count int `json:"count"`
	} `json:"meta"`
	Data map[string]struct {
		Description string `json:"description"`
	} `json:"data"`
	Status string `json:"status"`
}
