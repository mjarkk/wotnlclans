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

// PlayerInfoLogedIn is a type for the playerInfoLogedIn route
type PlayerInfoLogedIn struct {
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
		ClientLanguage string `json:"client_language"`
		LastBattleTime int    `json:"last_battle_time"`
		AccountAd      int    `json:"account_id"`
		CreatedAt      int    `json:"created_at"`
		UpdatedAt      int    `json:"updated_at"`
		GlobalRating   int    `json:"global_rating"`
		ClanID         int    `json:"clan_id"`
		NickName       string `json:"nickname"`
		LogoutAt       int    `json:"logout_at"`
		Private        struct {
			Restrictions struct {
				ChatBanTime int `json:"chat_ban_time"`
			} `json:"restrictions"`
			Gold             int  `json:"gold"`
			FreeXP           int  `json:"free_xp"`
			BanTime          int  `json:"ban_time"`
			IsBoundToPhone   bool `json:"is_bound_to_phone"`
			IsPremium        bool `json:"is_premium"`
			Credits          int  `json:"credits"`
			PremiumExpiresAt int  `json:"premium_expires_at"`
			Bonds            int  `json:"bonds"`
			BattleLifeTime   int  `json:"battle_life_time"`
			BanInfo          int  `json:"ban_info"`
		} `json:"private"`
		Statistics struct {
			TreesCut int `json:"trees_cut"`
			Clan     struct {
				Spotted                    float64 `json:"spotted"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				AvgDamageBlocked           float64 `json:"avg_damage_blocked"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				ExplosionHits              float64 `json:"explosion_hits"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Piercings                  float64 `json:"piercings"`
				XP                         float64 `json:"xp"`
				SurvivedBattles            float64 `json:"survived_battles"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				HitsPercents               float64 `json:"hits_percents"`
				Draws                      float64 `json:"draws"`
				Battles                    float64 `json:"battles"`
				DamageReceived             float64 `json:"damage_received"`
				AvgDamageAssisted          float64 `json:"avg_damage_assisted"`
				AvgDamageAssistedTrack     float64 `json:"avg_damage_assisted_track"`
				Frags                      float64 `json:"frags"`
				StunNumber                 float64 `json:"stun_number"`
				AvgDamageAssistedRadio     float64 `json:"avg_damage_assisted_radio"`
				CapturePoints              float64 `json:"capture_points"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				Hits                       float64 `json:"hits"`
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Wins                       float64 `json:"wins"`
				Losses                     float64 `json:"losses"`
				DamageDealt                float64 `json:"damage_dealt"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Shots                      float64 `json:"shots"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				TankingFactor              float64 `json:"tanking_factor"`
			} `json:"clan"`
			All struct {
				AvgDamageAssisted          float64 `json:"avg_damage_assisted"`
				AvgDamageAssistedRadio     float64 `json:"avg_damage_assisted_radio"`
				AvgDamageAssistedTrack     float64 `json:"avg_damage_assisted_track"`
				AvgDamageBlocked           float64 `json:"avg_damage_blocked"`
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"all"`
			RegularTeam struct {
				AvgDamageAssisted          float64 `json:"avg_damage_assisted"`
				AvgDamageAssistedRadio     float64 `json:"avg_damage_assisted_radio"`
				AvgDamageAssistedTrack     float64 `json:"avg_damage_assisted_track"`
				AvgDamageBlocked           float64 `json:"avg_damage_blocked"`
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"regular_team"`
			Historical struct {
				AvgDamageAssisted          float64 `json:"avg_damage_assisted"`
				AvgDamageAssistedRadio     float64 `json:"avg_damage_assisted_radio"`
				AvgDamageAssistedTrack     float64 `json:"avg_damage_assisted_track"`
				AvgDamageBlocked           float64 `json:"avg_damage_blocked"`
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"historical"`
			StrongholdDefense struct {
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"stronghold_defense"`
			StrongholdSkirmish struct {
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"stronghold_skirmish"`
			Team struct {
				AvgDamageAssisted          float64 `json:"avg_damage_assisted"`
				AvgDamageAssistedRadio     float64 `json:"avg_damage_assisted_radio"`
				AvgDamageAssistedTrack     float64 `json:"avg_damage_assisted_track"`
				AvgDamageBlocked           float64 `json:"avg_damage_blocked"`
				BattleAvgXp                float64 `json:"battle_avg_xp"`
				Battles                    float64 `json:"battles"`
				BattlesOnStunningVehicles  float64 `json:"battles_on_stunning_vehicles"`
				CapturePoints              float64 `json:"capture_points"`
				DamageDealt                float64 `json:"damage_dealt"`
				DamageReceived             float64 `json:"damage_received"`
				DirectHitsReceived         float64 `json:"direct_hits_received"`
				Draws                      float64 `json:"draws"`
				DroppedCapturePoints       float64 `json:"dropped_capture_points"`
				ExplosionHits              float64 `json:"explosion_hits"`
				ExplosionHitsReceived      float64 `json:"explosion_hits_received"`
				Frags                      float64 `json:"frags"`
				Hits                       float64 `json:"hits"`
				HitsPercents               float64 `json:"hits_percents"`
				Losses                     float64 `json:"losses"`
				MaxDamage                  float64 `json:"max_damage"`
				MaxDamageTankID            float64 `json:"max_damage_tank_id"`
				MaxFrags                   float64 `json:"max_frags"`
				MaxFragsTankID             float64 `json:"max_frags_tank_id"`
				MaxXp                      float64 `json:"max_xp"`
				MaxXpTankID                float64 `json:"max_xp_tank_id"`
				NoDamageDirectHitsReceived float64 `json:"no_damage_direct_hits_received"`
				Piercings                  float64 `json:"piercings"`
				PiercingsReceived          float64 `json:"piercings_received"`
				Shots                      float64 `json:"shots"`
				Spotted                    float64 `json:"spotted"`
				StunAssistedDamage         float64 `json:"stun_assisted_damage"`
				StunNumber                 float64 `json:"stun_number"`
				SurvivedBattles            float64 `json:"survived_battles"`
				TankingFactor              float64 `json:"tanking_factor"`
				Wins                       float64 `json:"wins"`
				Xp                         float64 `json:"xp"`
			} `json:"team"`
			Frags map[string]int `json:"frags"`
		} `json:"statistics"`
	} `json:"data"`
}
