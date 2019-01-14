package db

// PostBlockedClans is post data type for the web server
type PostBlockedClans struct {
	UserID  string       `json:"userID"`
	UserKey string       `json:"userKey"`
	Clans   BlockedClans `json:"clans"`
}

// BlockedClans is a list of blocked clans
type BlockedClans []string

// UpdateDB updates the blocked clans list in the database
func (c *BlockedClans) UpdateDB() error {
	return nil
}

// GetBlockedClans retruns a list of blocked clans from the database
func GetBlockedClans() (BlockedClans, error) {
	return BlockedClans{}, nil
}

// PostExtraClans is post data type for the web server
type PostExtraClans struct {
	UserID  string     `json:"userID"`
	UserKey string     `json:"userKey"`
	Clans   ExtraClans `json:"clans"`
}

// ExtraClans is a list of extra clans
type ExtraClans []string

// UpdateDB updates the blocked clans list in the database
func (c *ExtraClans) UpdateDB() error {
	return nil
}

// GetExtraClans retruns a list of extra clans from the database
func GetExtraClans() (ExtraClans, error) {
	return ExtraClans{}, nil
}
