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
