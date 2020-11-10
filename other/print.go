package other

import (
	"fmt"
)

// DevPrint only prints when there the -dev flag is given
func DevPrint(inputs ...interface{}) {
	flagsLock.Lock()
	defer flagsLock.Unlock()
	if flags.Dev {
		fmt.Println(inputs...)
	}
}
