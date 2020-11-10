package db

import (
	"fmt"
)

// LogErr logs an error message
func LogErr(from, message, pkg string) {
	fmt.Printf("From: %s, pkg: %s, error: %s", from, message, pkg)
}
