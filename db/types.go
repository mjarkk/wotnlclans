package db

// ClanStats is what to be exepects to get back per clan from the database when requesting the current clan stats
type ClanStats struct {
	Tag         string            `json:"tag" bson:"tag"`
	Name        string            `json:"name" bson:"name"`
	Color       string            `json:"color" bson:"color"`
	Members     int               `json:"members" bson:"members"`
	Description string            `json:"description" bson:"description"`
	Motto       string            `json:"motto" bson:"motto"`
	ID          string            `json:"id" bson:"id"`
	Emblems     map[string]string `json:"emblems" bson:"emblems"`
	Blocked     bool              `json:"blocked" bson:"blocked"`
	Stats       HistoryClanStats  `json:"stats" bson:"stats"`
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
type HistoryClanStats struct {
	Tag                string  `json:"tag" bson:"tag"`
	Name               string  `json:"name" bson:"name"`
	ID                 string  `json:"id" bson:"id"`
	Members            int     `json:"members" bson:"members"`
	Battles            float64 `json:"battles" bson:"battles"`
	DailyBattles       float64 `json:"dailybattles" bson:"dailybattles"`
	Efficiency         float64 `json:"efficiency" bson:"efficiency"`
	FbElo10            float64 `json:"fbelo10" bson:"fbelo10"`
	FbElo8             float64 `json:"fbelo8" bson:"fbelo8"`
	FbElo6             float64 `json:"fbelo6" bson:"fbelo6"`
	FbElo              float64 `json:"fbelo" bson:"fbelo"`
	GmElo10            float64 `json:"gmelo10" bson:"gmelo10"`
	GmElo8             float64 `json:"gmelo8" bson:"gmelo8"`
	GmElo6             float64 `json:"gmelo6" bson:"gmelo6"`
	GmElo              float64 `json:"gmelo" bson:"gmelo"`
	GlobRating         float64 `json:"globrating" bson:"globrating"`
	GlobRatingWeighted float64 `json:"globRatingweighted" bson:"globRatingweighted"`
	WinRatio           float64 `json:"winratio" bson:"winratio"`
	V10l               float64 `json:"v10l" bson:"v10l"`
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
type HistoryCollectionItem struct {
	Date  string             `json:"date"`
	Stats []HistoryClanStats `json:"stats"`
}

// User defines what a user is
type User struct {
	Rights   string `json:"rights" bson:"rights"`
	UserID   int    `json:"userid" bson:"userid"`
	NickName string `json:"nickname" bson:"nickname"`
}

// ClanPositionEvery this shows the clan possition in all type stats
type ClanPositionEvery struct {
	V10l           int `json:"v10l" bson:"v10l"`
	Winratio       int `json:"winratio" bson:"winratio"`
	GlobalWeighted int `json:"globalWeighted" bson:"globalweighted"`
	Global         int `json:"global" bson:"global"`
	Gmelo          int `json:"gmelo" bson:"gmelo"`
	Gmelo6         int `json:"gmelo6" bson:"gmelo6"`
	Gmelo8         int `json:"gmelo8" bson:"gmelo8"`
	Gmelo10        int `json:"gmelo10" bson:"gmelo10"`
	Fbelo          int `json:"fbelo" bson:"fbelo"`
	Fbelo6         int `json:"fbelo6" bson:"fbelo6"`
	Fbelo8         int `json:"fbelo8" bson:"fbelo8"`
	Fbelo10        int `json:"fbelo10" bson:"fbelo10"`
	Efficiency     int `json:"efficiency" bson:"efficiency"`
	Dailybattles   int `json:"dailybattles" bson:"dailybattles"`
	Battles        int `json:"battles" bson:"battles"`
	Members        int `json:"members" bson:"members"`
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
type ClanNameAndTag struct {
	Tag  string
	Name string
}
