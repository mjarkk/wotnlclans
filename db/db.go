package db

import (
	"sync"

	"github.com/mjarkk/wotclans/other"
)

var clanIDsLock sync.Mutex
var clanIDs = map[string]struct{}{}
var extraClanIDs = map[string]struct{}{}

// RemoveClanIDs removes the "toRemove" from the clan IDs collection
func RemoveClanIDs(toRemoveIDS []string) {
	if len(toRemoveIDS) == 0 {
		return
	}
	clanIDsLock.Lock()
	defer clanIDsLock.Unlock()
	for _, id := range toRemoveIDS {
		id = other.RemoveQuotes(id)
		delete(clanIDs, id)
		delete(extraClanIDs, id)
	}
}

// GetClanIDs returns the clans ids that where found after searching for new clans
func GetClanIDs() []string {
	clanIDsLock.Lock()
	defer clanIDsLock.Unlock()

	toReturn := []string{}
	for id := range clanIDs {
		toReturn = append(toReturn, other.RemoveQuotes(id))
	}

	return toReturn
}

// SetClanIDs saves a list of clan id's in the database
func SetClanIDs(ids []string) {
	clanIDsLock.Lock()
	defer clanIDsLock.Unlock()

	for _, id := range ids {
		clanIDs[id] = struct{}{}
	}
}
