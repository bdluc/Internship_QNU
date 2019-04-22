package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CheckError(c *gin.Context, err error) bool {
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Error!",
		})
		c.Error(err)
		return true
	}
	return false
}

func CheckNotFound(c *gin.Context, err error) bool {
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Success",
		})
		return true
	}
	return false
}

func IsError(c *gin.Context, e error, m string) bool {
	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": m,
		})
		return true
	}
	return false
}
