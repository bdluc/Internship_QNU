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
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return true
	}
	return false
}

func IsError(c *gin.Context, e error, m string) bool {
	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": m,
		})
		c.Error(e)
		return true
	}
	return false
}
