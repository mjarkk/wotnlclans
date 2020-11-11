package db

// the sorting file for the clanData.go

import (
	"errors"
	"sort"
	"sync"
)

// SortedRating is a sorted list that contains every clan with it's possition in a field
var SortedRating = map[string]ClanPositionEvery{}
var SortedRatingLock sync.Mutex

// SortClanIds makes a pre sorted list of all clans
func SortClanIds() {
	clans := []ClanStats{}
	out := map[string]ClanPositionEvery{}

	currentStats, unlock := GetCurrentStats()
	for _, clan := range currentStats {
		clans = append(clans, clan)
		out[clan.ID] = ClanPositionEvery{} // map ever clan id to the map
	}
	unlock()

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

	SortedRatingLock.Lock()
	defer SortedRatingLock.Unlock()
	SortedRating = out
}

// LightClanPositions does mostly the same as sortClanIds
// this one tells per clan the posstion instaid of per cataory every clan's possition
func LightClanPositions(itemToGet string) (map[string]interface{}, error) {
	SortedRatingLock.Lock()
	defer SortedRatingLock.Unlock()

	toReturn := map[string]interface{}{}

	if itemToGet == "all" {
		toReturn["actualData"] = map[string][]int{}
		for clanID, clan := range SortedRating {
			toReturn["actualData"].(map[string][]int)[clanID] = []int{
				clan.Members,
				clan.Battles,
				clan.Dailybattles,
				clan.Efficiency,
				clan.Fbelo10,
				clan.Fbelo8,
				clan.Fbelo6,
				clan.Fbelo,
				clan.Gmelo10,
				clan.Gmelo8,
				clan.Gmelo8,
				clan.Gmelo,
				clan.Global,
				clan.GlobalWeighted,
				clan.Winratio,
				clan.V10l,
			}
		}
		toReturn["dataMapping"] = []string{
			"members",
			"battles",
			"dailybattles",
			"efficiency",
			"fbelo10",
			"fbelo8",
			"fbelo6",
			"fbelo",
			"gmelo10",
			"gmelo8",
			"gmelo6",
			"gmelo",
			"globrating",
			"globRatingweighted",
			"winratio",
			"v10l",
		}
	} else {
		toReturn["actualData"] = map[string]int{}
		for clanID, clan := range SortedRating {
			switch itemToGet {
			case "members":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Members
			case "battles":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Battles
			case "dailybattles":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Dailybattles
			case "efficiency":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Efficiency
			case "fbelo10":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo10
			case "fbelo8":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo8
			case "fbelo6":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo6
			case "fbelo":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Fbelo
			case "gmelo10":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo10
			case "gmelo8":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo8
			case "gmelo6":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo6
			case "gmelo":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Gmelo
			case "globrating":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Global
			case "globRatingweighted":
				toReturn["actualData"].(map[string]int)[clanID] = clan.GlobalWeighted
			case "winratio":
				toReturn["actualData"].(map[string]int)[clanID] = clan.Winratio
			case "v10l":
				toReturn["actualData"].(map[string]int)[clanID] = clan.V10l
			default:
				return toReturn, errors.New("\"" + itemToGet + "\" can't be filterd on")
			}
		}
	}
	return toReturn, nil
}
