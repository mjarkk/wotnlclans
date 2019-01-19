package db

import (
	"errors"
	"sort"

	"github.com/mjarkk/wotnlclans/other"
	"github.com/mongodb/mongo-go-driver/bson"
)

// GetCurrentClansData returns all clan data
func GetCurrentClansData() ([]ClanStats, error) {
	collection := DB.Collection("currentStats")
	query := bson.M{
		"tag":     bson.M{"$exists": true, "$ne": ""},
		"blocked": false,
	}
	cur, err := collection.Find(C(), query)
	toReturn := []ClanStats{}
	if err != nil {
		return toReturn, other.NewErr("collection.Find", err)
	}
	defer cur.Close(C())
	for cur.Next(C()) {
		var toAdd ClanStats
		err := cur.Decode(&toAdd)
		if err != nil {
			return toReturn, other.NewErr("cur.Decode", err)
		}
		toReturn = append(toReturn, toAdd)
	}

	return toReturn, nil
}

// GetCurrentClansByID filter the list with spesific IDs
func GetCurrentClansByID(ids ...string) ([]ClanStats, error) {
	toReturn := []ClanStats{}
	if len(ids) > 200 {
		return toReturn, errors.New("To menny id's")
	}
	if len(ids) == 0 {
		return toReturn, nil
	}
	clans, err := GetCurrentClansData()
	if err != nil {
		return toReturn, err
	}
	for _, clan := range clans {
		for _, id := range ids {
			if clan.ID == id {
				toReturn = append(toReturn, clan)
			}
		}
	}
	return toReturn, nil
}

// CurrentDefaultFiltered returnes the default filtered item
func CurrentDefaultFiltered() string {
	return "efficiency"
}

// GetCurrentClansTop returns the top of some amound of clans
func GetCurrentClansTop(maxAmound int) ([]ClanStats, error) {
	toReturn := make([]ClanStats, len(SortedRating))
	clansMapped := map[string]ClanStats{}

	clans, err := GetCurrentClansData()
	if err != nil {
		return toReturn, err
	}

	for _, clan := range clans {
		clansMapped[clan.ID] = clan
	}

	for clanID, positions := range SortedRating {
		toReturn[positions.Efficiency] = clansMapped[clanID]
	}

	toReturnWithMax := []ClanStats{}

	for i, item := range toReturn {
		if i >= maxAmound {
			break
		}
		toReturnWithMax = append(toReturnWithMax, item)
	}

	return toReturnWithMax, nil
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

// SortedRating is a sorted list that contains every clan with it's possition in a field
var SortedRating = map[string]ClanPositionEvery{}

// sortClanIds makes a pre sorted list of all clans
func sortClanIds() error {
	clans, err := GetCurrentClansData()
	if err != nil {
		return err
	}

	out := map[string]ClanPositionEvery{}

	for _, clan := range clans {
		out[clan.ID] = ClanPositionEvery{} // map ever clan id to the map
	}

	itemsToSort := map[string]func([]ClanStats) []ClanStats{
		"members": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Members != cj.Members:
					return ci.Members < cj.Members
				default:
					return ci.Members < cj.Members
				}
			})
			return toSort
		},
		"battles": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.Battles != cj.Stats.Battles:
					return ci.Stats.Battles < cj.Stats.Battles
				default:
					return ci.Stats.Battles < cj.Stats.Battles
				}
			})
			return toSort
		},
		"dailybattles": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.DailyBattles != cj.Stats.DailyBattles:
					return ci.Stats.DailyBattles < cj.Stats.DailyBattles
				default:
					return ci.Stats.DailyBattles < cj.Stats.DailyBattles
				}
			})
			return toSort
		},
		"efficiency": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.Efficiency != cj.Stats.Efficiency:
					return ci.Stats.Efficiency < cj.Stats.Efficiency
				default:
					return ci.Stats.Efficiency < cj.Stats.Efficiency
				}
			})
			return toSort
		},
		"fbelo10": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.FbElo10 != cj.Stats.FbElo10:
					return ci.Stats.FbElo10 < cj.Stats.FbElo10
				default:
					return ci.Stats.FbElo10 < cj.Stats.FbElo10
				}
			})
			return toSort
		},
		"fbelo8": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.FbElo8 != cj.Stats.FbElo8:
					return ci.Stats.FbElo8 < cj.Stats.FbElo8
				default:
					return ci.Stats.FbElo8 < cj.Stats.FbElo8
				}
			})
			return toSort
		},
		"fbelo6": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.FbElo6 != cj.Stats.FbElo6:
					return ci.Stats.FbElo6 < cj.Stats.FbElo6
				default:
					return ci.Stats.FbElo6 < cj.Stats.FbElo6
				}
			})
			return toSort
		},
		"fbelo": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.FbElo != cj.Stats.FbElo:
					return ci.Stats.FbElo < cj.Stats.FbElo
				default:
					return ci.Stats.FbElo < cj.Stats.FbElo
				}
			})
			return toSort
		},
		"gmelo10": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GmElo10 != cj.Stats.GmElo10:
					return ci.Stats.GmElo10 < cj.Stats.GmElo10
				default:
					return ci.Stats.GmElo10 < cj.Stats.GmElo10
				}
			})
			return toSort
		},
		"gmelo8": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GmElo8 != cj.Stats.GmElo8:
					return ci.Stats.GmElo8 < cj.Stats.GmElo8
				default:
					return ci.Stats.GmElo8 < cj.Stats.GmElo8
				}
			})
			return toSort
		},
		"gmelo6": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GmElo6 != cj.Stats.GmElo6:
					return ci.Stats.GmElo6 < cj.Stats.GmElo6
				default:
					return ci.Stats.GmElo6 < cj.Stats.GmElo6
				}
			})
			return toSort
		},
		"gmelo": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GmElo != cj.Stats.GmElo:
					return ci.Stats.GmElo < cj.Stats.GmElo
				default:
					return ci.Stats.GmElo < cj.Stats.GmElo
				}
			})
			return toSort
		},
		"globrating": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GlobRating != cj.Stats.GlobRating:
					return ci.Stats.GlobRating < cj.Stats.GlobRating
				default:
					return ci.Stats.GlobRating < cj.Stats.GlobRating
				}
			})
			return toSort
		},
		"globRatingweighted": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.GlobRatingWeighted != cj.Stats.GlobRatingWeighted:
					return ci.Stats.GlobRatingWeighted < cj.Stats.GlobRatingWeighted
				default:
					return ci.Stats.GlobRatingWeighted < cj.Stats.GlobRatingWeighted
				}
			})
			return toSort
		},
		"winratio": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.WinRatio != cj.Stats.WinRatio:
					return ci.Stats.WinRatio < cj.Stats.WinRatio
				default:
					return ci.Stats.WinRatio < cj.Stats.WinRatio
				}
			})
			return toSort
		},
		"v10l": func(toSort []ClanStats) []ClanStats {
			sort.SliceStable(toSort, func(i, j int) bool {
				ci, cj := toSort[i], toSort[j]
				switch {
				case ci.Stats.V10l != cj.Stats.V10l:
					return ci.Stats.V10l < cj.Stats.V10l
				default:
					return ci.Stats.V10l < cj.Stats.V10l
				}
			})
			return toSort
		},
	}

	for id, filterFunc := range itemsToSort {
		filterFunc(clans)
		for i := 0; i < len(clans)/2; i++ {
			j := len(clans) - i - 1
			clans[i], clans[j] = clans[j], clans[i]
		}
		for rank, clan := range clans {
			newData := out[clan.ID]
			switch id {
			case "members":
				newData.Members = rank
			case "battles":
				newData.Battles = rank
			case "dailybattles":
				newData.Dailybattles = rank
			case "efficiency":
				newData.Efficiency = rank
			case "fbelo10":
				newData.Fbelo10 = rank
			case "fbelo8":
				newData.Fbelo8 = rank
			case "fbelo6":
				newData.Fbelo6 = rank
			case "fbelo":
				newData.Fbelo = rank
			case "gmelo10":
				newData.Gmelo10 = rank
			case "gmelo8":
				newData.Gmelo8 = rank
			case "gmelo6":
				newData.Gmelo6 = rank
			case "gmelo":
				newData.Gmelo = rank
			case "globrating":
				newData.Global = rank
			case "globRatingweighted":
				newData.GlobalWeighted = rank
			case "winratio":
				newData.Winratio = rank
			case "v10l":
				newData.V10l = rank
			}
			out[clan.ID] = newData
		}
	}

	SortedRating = out

	return nil
}

// SetCurrentClansData saves the latest clan data in the database
func SetCurrentClansData(stats []ClanStats) error {
	filteredStats := []ClanStats{}

	for _, stat := range stats {
		if len(stat.ID) > 1 && len(stat.Tag) > 1 {
			filteredStats = append(filteredStats, stat)
		}
	}

	if len(filteredStats) == 0 {
		return errors.New("SetCurrentClansData got a empty array")
	}
	toInsert := make([]interface{}, len(filteredStats))
	toInsertHistory := make([]interface{}, len(filteredStats))
	for i, item := range filteredStats {
		toInsert[i] = item
		toInsertHistory[i] = item.Stats
	}
	collection := DB.Collection("currentStats")
	collection.Drop(C())
	_, err := collection.InsertMany(C(), toInsert)

	sortClanIds()

	return err
}
