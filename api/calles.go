package api

import (
	"errors"
	"fmt"
)

// Res is what is send back in a channel if a request is dune
type Res struct {
	Output string
	Error  error
}

// CallAPI is how to query a call to an api
type CallAPI struct {
	URL   string
	Event chan Res
}

// JobsType is the type for Jobs
type JobsType struct {
	Max  []CallAPI
	Mid  []CallAPI
	Less []CallAPI
}

// Jobs is just a list of things to do, the max, mid and less just show the code how inportant a request is
var Jobs JobsType

// isBuzzy shows if setup is buzzy doing things
var isBuzzy = false

// Setup starts the job fetcher
func (j JobsType) Setup() {
	if isBuzzy {
		return
	}
	isBuzzy = true
	maxCopy := make([]CallAPI, len(Jobs.Max))
	copy(Jobs.Max, maxCopy)
	midCopy := make([]CallAPI, len(Jobs.Max))
	copy(Jobs.Mid, midCopy)
	lessCopy := make([]CallAPI, len(Jobs.Less))
	copy(Jobs.Less, lessCopy)

	go func() {
		for {
			if len(maxCopy) > 0 {
				// req := HttpRequest.NewRequest()
				// res, err := req.Post(job.URL, nil)
				// res.Body()
				job := maxCopy[0]
				job.Event <- Res{
					Output: job.URL,
					Error:  nil,
				}
				Jobs.Max = Jobs.Max[1:]
			}
		}
	}()

	go func() {
		fmt.Println(len(Jobs.Max))

		// for importancy, originalContent := range map[string]*[]CallAPI{
		// 	"Max":  &Jobs.Max,
		// 	"Mid":  &Jobs.Mid,
		// 	"Less": &Jobs.Less,
		// } {
		// testLoop:
		// 	for true {
		// 		if len(*originalContent) == 0 {
		// 			break testLoop
		// 		}
		// 		job := (*originalContent)[0]

		// 		switch importancy {
		// 		case "Max":
		// 			Jobs.Max = Jobs.Max[1:]
		// 		case "Mid":
		// 			Jobs.Mid = Jobs.Mid[1:]
		// 		case "Less":
		// 			Jobs.Less = Jobs.Less[1:]
		// 		}
		// 	}
		// }
		isBuzzy = false
	}()
}

// Add adds a job to Jobs
// Dune is a channel that returns when the request is dune
func (j JobsType) Add(inportantcy string, url string, payload map[string]string) (chan Res, error) {
	dune := make(chan Res)
	url, err := GetAPIRoute(url, payload)
	if err != nil {
		return dune, err
	}
	apiCall := CallAPI{
		URL:   url,
		Event: dune,
	}

	switch inportantcy {
	case "Max":
		Jobs.Max = append(Jobs.Max, apiCall)
	case "Mid":
		Jobs.Mid = append(Jobs.Mid, apiCall)
	case "Less":
		Jobs.Less = append(Jobs.Less, apiCall)
	default:
		return dune, errors.New("invalid arguments \"inportantcy\" needs to be Max, Mid or Less")
	}

	Jobs.Setup()

	return dune, nil
}
