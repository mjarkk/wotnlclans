package other

import (
	"fmt"
)

// DevPrint only prints when there the -dev flag is given
func DevPrint(inputs ...interface{}) {
	if Flags.Dev {
		fmt.Println(inputs...)
	}
}
