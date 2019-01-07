package other

import "errors"

// NewErr can add extra info to an error
func NewErr(prefix string, actualError error) error {
	return errors.New(prefix + ": " + actualError.Error())
}
