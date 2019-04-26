package models

import (
	gomail "gopkg.in/gomail.v2"
)

type Email struct {
	From     string
	To       string
	Subject  string
	Body     string
	Username string
	Password string
}

func SendEMail(email Email) error {
	m := gomail.NewMessage()
	m.SetHeader("From", email.From)
	m.SetHeader("To", email.To)
	m.SetHeader("Subject", email.Subject)
	m.SetBody("text/plain", email.Body)

	d := gomail.NewDialer("smtp.gmail.com", 587, email.Username, email.Password)

	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
