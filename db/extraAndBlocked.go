package db

import (
	"sync"
)

var blockedClansLock sync.Mutex
var blockedClans = map[string]struct{}{}

var extraClansLock sync.Mutex
var extraClans = map[string]struct{}{}

// GetBlockedClans returns all blocked clans
func GetBlockedClans() map[string]struct{} {
	extraClansLock.Lock()
	defer extraClansLock.Unlock()
	return extraClans
}

// GetExtraClans returns all extra clans
func GetExtraClans() map[string]struct{} {
	extraClansLock.Lock()
	defer extraClansLock.Unlock()
	return extraClans
}
