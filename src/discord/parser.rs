// package discord

// import (
// 	"strings"
// )

// // parse parses a user command and returns a output text to return
// func parse(prefix string, input []string) string {
// 	DidYouMean := "Did you mean `" + prefix + " help`"
// 	for _, option := range OptionsList {
// 		toTest := strings.Split(option.ToMatch, " ")
// 		if len(input) == len(toTest) {
// 			isValid := true
// 			insertToFunc := []string{}
// 		inputForLoop:
// 			for i := range input {
// 				matchItem := toTest[i]
// 				inputItem := input[i]
// 				if strings.HasPrefix(matchItem, "{{") {
// 					insertToFunc = append(insertToFunc, inputItem)
// 					continue inputForLoop
// 				}
// 				if strings.ToLower(matchItem) == strings.ToLower(inputItem) {
// 					continue inputForLoop
// 				}
// 				isValid = false
// 				break inputForLoop
// 			}
// 			if isValid {
// 				out, err := option.Command(OptionsList, prefix, insertToFunc...)
// 				if err != nil {
// 					return DidYouMean
// 				}
// 				return out
// 			}
// 		}
// 	}
// 	return DidYouMean
// }
