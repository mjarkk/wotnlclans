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

// LoginLink is a type for the loginLink route
type LoginLink struct {
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
	Data struct {
		Location string `json:"location"`
	} `json:"data"`
}

// ClanRating is a type for the clanRating route
type ClanRating struct {
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
		ClanID          int    `json:"clan_id"`
		ClanName        string `json:"clan_name"`
		ClanTag         string `json:"clan_tag"`
		BattlesCountAvg struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"battles_count_avg"`
		BattlesCountAvgDaily struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"battles_count_avg_daily"`
		Efficiency struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"efficiency"`
		ExcludeReasons map[string]string `json:"exclude_reasons"`
		FbEloRating    struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"fb_elo_rating"`
		FbEloRating10 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"fb_elo_rating_10"`
		FbEloRating6 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"fb_elo_rating_6"`
		FbEloRating8 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"fb_elo_rating_8"`
		GlobalRatingAvg struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"global_rating_avg"`
		GlobalRatingWeightedAvg struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"global_rating_weighted_avg"`
		GmEloRating struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"gm_elo_rating"`
		GmEloRating10 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"gm_elo_rating_10"`
		GmEloRating6 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"gm_elo_rating_6"`
		GmEloRating8 struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"gm_elo_rating_8"`
		RatingFort struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"rating_fort"`
		V10lAvg struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"v10l_avg"`
		WinsRatioAvg struct {
			Rank      float64 `json:"rank"`
			RankDelta float64 `json:"rank_delta"`
			Value     float64 `json:"value"`
		} `json:"wins_ratio_avg"`
	} `json:"data"`
}
