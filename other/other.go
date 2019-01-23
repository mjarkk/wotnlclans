package other

import (
	"crypto/sha1"
	"fmt"
	"strings"
)

// GetDomain returns the domain of a input string
// Example:
//    domain := other.GetDomain("https://test.somedomain.com/idk")
//    fmt.Println(domain) // -> test.somedomain.com
func GetDomain(input string) string {
	workingOn := input
	if strings.Contains(input, "http://") || strings.Contains(input, "https://") {
		workingOn = strings.Split(input, "//")[1]
	}
	return strings.Split(strings.Split(strings.Split(workingOn, "/")[0], "#")[0], "?")[0]
}

// GetHash returns the sha1 hash of the input
func GetHash(input []byte) string {
	return fmt.Sprintf("%x", sha1.Sum(input))
}

// RemoveQuotes removes quotes from all strings in a list
// for some reason the database sometimes returns "" arounds clan ID strings
func RemoveQuotes(input []string) []string {
	toReturn := []string{}
	for _, item := range input {
		toReturn = append(toReturn, strings.Replace(item, "\"", "", -1))
	}
	return toReturn
}
