package controllers

import (
	"net/http"

	"../models"
	"github.com/gin-gonic/gin"
	// "gorilla/mux"
	// "gorilla/securecookie"
)

//login handle for login
func Login(c *gin.Context) {
	var userData models.User
	if err := c.ShouldBindJSON(&userData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if userData.UserName != "admin" || userData.Password != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
}

/*
var cookieHandler = securecookie.New(
    securecookie.GenerateRandomKey(64),
    securecookie.GenerateRandomKey(32))

func getSession(request *http.Request) (yourName string) {
    if cookie, err := request.Cookie("your-name"); err == nil {
        cookieValue := make(map[string]string)
        if err = cookieHandler.Decode("your-name", cookie.Value, &cookieValue); err == nil {
            yourName = cookieValue["your-name"]
        }
    }
    return yourName
}

func setSession(yourName string, response http.ResponseWriter) {
    value := map[string]string{
        "your-name": yourName,
    }
    if encoded, err := cookieHandler.Encode("your-name", value); err == nil {
        cookie := &http.Cookie{
            Name:  "your-name",
            Value: encoded,
            Path:  "/",
            MaxAge: 3600,
        }
        http.SetCookie(response, cookie)
    }
}

func clearSession(response http.ResponseWriter) {
    cookie := &http.Cookie{
        Name:   "your-name",
        Value:  "",
        Path:   "/",
        MaxAge: -1,
    }
    http.SetCookie(response, cookie)
}


func setSessionHandler(response http.ResponseWriter, request *http.Request) {
    name := request.FormValue("name")
    redirectTarget := "/"
    if name != "" {
        setSession(name, response)
        redirectTarget = "/page1"
    }
    http.Redirect(response, request, redirectTarget, 302)
}



func clearSessionHandler(response http.ResponseWriter, request *http.Request) {
    clearSession(response)
    http.Redirect(response, request, "/", 302)
}
*/
