package db

// ClanStats is what to be exepects to get back per clan from the database when requesting the current clan stats
type ClanStats struct {
	Tag         string
	Name        string
	Color       string
	Members     int
	Description string
	Motto       string
	ID          string
	Emblems     map[string]string
	Stats       HistoryClanStats
}

// HistoryClanStats this is what to be exepected to get back per clan from the database when requesting old clan data
type HistoryClanStats struct {
	Tag                string
	Name               string
	ID                 string
	Members            int
	Battles            float64
	DailyBattles       float64
	Efficiency         float64
	FbElo10            float64
	FbElo8             float64
	FbElo6             float64
	FbElo              float64
	GmElo10            float64
	GmElo8             float64
	GmElo6             float64
	GmElo              float64
	GlobRating         float64
	GlobRatingWeighted float64
	WinRatio           float64
	V10l               float64
}

// HistoryCollectionItem is what the contens is of 1 hisotry colleciton item
type HistoryCollectionItem struct {
	Date  string
	Stats []HistoryClanStats
}
