package db

// ClanStats is what to be exepects to get back per clan from the database when requesting the current clan stats
type ClanStats struct {
	Tag         string            `json:"tag"`
	Name        string            `json:"name"`
	Color       string            `json:"color"`
	Members     int               `json:"members"`
	Description string            `json:"description"`
	Motto       string            `json:"motto"`
	ID          string            `json:"id"`
	Emblems     map[string]string `json:"emblems"`
	Blocked     bool              `json:"blocked"`
	Stats       HistoryClanStats  `json:"stats"`
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
type HistoryClanStats struct {
	Tag                string  `json:"tag"`
	Name               string  `json:"name"`
	ID                 string  `json:"id"`
	Members            int     `json:"members"`
	Battles            float64 `json:"battles"`
	DailyBattles       float64 `json:"dailybattles"`
	Efficiency         float64 `json:"efficiency"`
	FbElo10            float64 `json:"fbelo10"`
	FbElo8             float64 `json:"fbelo8"`
	FbElo6             float64 `json:"fbelo6"`
	FbElo              float64 `json:"fbelo"`
	GmElo10            float64 `json:"gmelo10"`
	GmElo8             float64 `json:"gmelo8"`
	GmElo6             float64 `json:"gmelo6"`
	GmElo              float64 `json:"gmelo"`
	GlobRating         float64 `json:"globrating"`
	GlobRatingWeighted float64 `json:"globRatingweighted"`
	WinRatio           float64 `json:"winratio"`
	V10l               float64 `json:"v10l"`
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
type HistoryCollectionItem struct {
	Date  string             `json:"date"`
	Stats []HistoryClanStats `json:"stats"`
}

// User defines what a user is
type User struct {
	Rights   string               `json:"rights"`
	UserID   int                  `json:"userid"`
	NickName string               `json:"nickname"`
	Tokens   map[string]UserToken `json:"tokens"`
}

// UserToken is a user to that someone can use to login
type UserToken struct {
	ValidTo  string `json:"validto"`
	Key      string `json:"key"`
	LastUsed string `json:"lastused"`
}

// ClanPositionEvery this shows the clan possition in all type stats
type ClanPositionEvery struct {
	V10l           int `json:"v10l"`
	Winratio       int `json:"winratio"`
	GlobalWeighted int `json:"globalWeighted"`
	Global         int `json:"global"`
	Gmelo          int `json:"gmelo"`
	Gmelo6         int `json:"gmelo6"`
	Gmelo8         int `json:"gmelo8"`
	Gmelo10        int `json:"gmelo10"`
	Fbelo          int `json:"fbelo"`
	Fbelo6         int `json:"fbelo6"`
	Fbelo8         int `json:"fbelo8"`
	Fbelo10        int `json:"fbelo10"`
	Efficiency     int `json:"efficiency"`
	Dailybattles   int `json:"dailybattles"`
	Battles        int `json:"battles"`
	Members        int `json:"members"`
}

// ClanNameAndTag is a type that has the tag, name and id of a clan
type ClanNameAndTag struct {
	Tag  string
	Name string
}
