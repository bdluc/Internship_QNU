package common

const (
	Sender     = "Tester"
	Receiver   = "congquan239@gmail.com"
	ReceiverCC = "tcquan@tma.com.vn"
	Subject    = "Weather Forecast in Quy Nhon"
	User       = "kanghyomun2@gmail.com"
	Password   = "12345678x@X87654321"

	MailServer = "smtp.gmail.com"
	MailType   = "text/html"

	ErrParsingTemplate  = "Parse template failed"
	TemplateWeatherPath = "templates/weather.html"

	ForecastType     = "5"
	Unit             = "C"
	Eng              = "EN"
	ApiKey           = "0bee2b9feadf0eac51ee2f066e616564"
	CityId           = 1568574
	ForecastDuration = 5

	Morning   = " AM"
	Afternoon = " PM"

	ApiKeyDarkSky = "246d34b59251fff6ccef77cbe820f2b5"
	// Get location : latlong.net
	CityName  = "Quy Nhon"
	Latitude  = "13.77648"
	Longitude = "109.22367"
	IconSign  = "https://i.screenshot.net/o8mp8hl"

	Status                = "status"
	Message               = "message"
	Error                 = "Error"
	NotFound              = "Not found"
	Failed                = "Failed"
	Success               = "Success"
	ErrReadingRequestData = "Can not read request's data."
	TraineeNotFound       = "Trainee not found."
	MentorNotFound        = "Mentor not found."
	ErrSendMail           = "Send email failed."
	SendMailSuccess       = "Send email successfully."

	DefaultPassword = "12345678x@X"
)

var ListIcons = map[string]string{
	"clear-day":           "https://i.screenshot.net/7nzevhw",
	"clear-night":         "https://i.screenshot.net/o8rjzug",
	"cloudy":              "https://i.screenshot.net/4w407hz",
	"fog":                 "https://i.screenshot.net/o7r2zie",
	"partly-cloudy-day":   "https://i.screenshot.net/7mwpytm",
	"partly-cloudy-night": "https://i.screenshot.net/ovlkzsd",
	"rain":                "https://i.screenshot.net/2540pay",
	"sleet":               "https://i.screenshot.net/k6wgotp",
	"snow":                "https://i.screenshot.net/7oyp1a5",
	"wind":                "https://i.screenshot.net/68593ug",
}
