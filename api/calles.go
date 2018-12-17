package api

// EventOutput is simply what might be output from the wargaminga api
type EventOutput struct {
}

// CallAPI is how to query a call to an api
type CallAPI struct {
	Payload map[string]string
	Event   chan EventOutput
}

// Jobs is just a list of things to do, the max, mid and less just show the code how inportant a request is
type Jobs struct {
	max  []CallAPI
	mid  []CallAPI
	less []CallAPI
}
