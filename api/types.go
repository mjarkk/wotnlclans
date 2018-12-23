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

// NicknameAndClan is a type for the nicknameAndClan route
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

// ClanDiscription is a type for the clanDiscription route
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
		Tag         string `json:"tag"`
	} `json:"data"`
	Status string `json:"status"`
}

// ClanData is a type for the clanData route
type ClanData struct {
	Status string `json:"status"`
	Error  struct {
		Code    int    `json:"code"`
		Field   string `json:"field"`
		Message string `json:"message"`
		Value   string `json:"value"`
	} `json:"error"`
	Meta struct {
		Count int `json:"count"`
	} `json:"meta"`
	Data map[string]struct {
		LeaderID            int         `json:"leader_id"`
		Color               string      `json:"color"`
		UpdatedAt           int         `json:"updated_at"`
		Private             interface{} `json:"private"`
		Tag                 string      `json:"tag"`
		MembersCount        int         `json:"members_count"`
		DescriptionHTML     string      `json:"description_html"`
		AcceptsJoinRequests bool        `json:"accepts_join_requests"`
		LeaderName          string      `json:"leader_name"`
		Emblems             struct {
			X32 struct {
				Portal string `json:"portal"`
			} `json:"x32"`
			X24 struct {
				Portal string `json:"portal"`
			} `json:"x24"`
			X256 struct {
				Wowp string `json:"wowp"`
			} `json:"x256"`
			X64 struct {
				Wot    string `json:"wot"`
				Portal string `json:"portal"`
			} `json:"x64"`
			X195 struct {
				Portal string `json:"portal"`
			} `json:"x195"`
		} `json:"emblems"`
		ClanID      int    `json:"clan_id"`
		RenamedAt   int    `json:"renamed_at"`
		OldTag      string `json:"old_tag"`
		Description string `json:"description"`
		Game        string `json:"game"`
		Members     []struct {
			Role        string `json:"role"`
			RoleI18N    string `json:"role_i18n"`
			JoinedAt    int    `json:"joined_at"`
			AccountID   int    `json:"account_id"`
			AccountName string `json:"account_name"`
		} `json:"members"`
		OldName         string `json:"old_name"`
		IsClanDisbanded bool   `json:"is_clan_disbanded"`
		Motto           string `json:"motto"`
		Name            string `json:"name"`
		CreatorName     string `json:"creator_name"`
		CreatedAt       int    `json:"created_at"`
		CreatorID       int    `json:"creator_id"`
	} `json:"data"`
}
