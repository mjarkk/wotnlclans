package other

import "fmt"

// DevPrint only prints when there the -dev flag is given
func (c *FlagsAndConfig) DevPrint(inputs ...interface{}) {
	if c.Dev {
		fmt.Println(inputs...)
	}
}
