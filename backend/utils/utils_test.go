package utils

import (
	"testing"
)

func TestHashPassword(t *testing.T) {
	password := "testpassword123"
	
	hash, err := HashPassword(password)
	if err != nil {
		t.Errorf("HashPassword failed: %v", err)
	}
	
	if hash == "" {
		t.Error("HashPassword returned empty hash")
	}
	
	if hash == password {
		t.Error("HashPassword returned the original password instead of a hash")
	}
}

func TestCheckPasswordHash(t *testing.T) {
	password := "testpassword123"
	wrongPassword := "wrongpassword"
	
	hash, err := HashPassword(password)
	if err != nil {
		t.Errorf("HashPassword failed: %v", err)
	}
	
	if !CheckPasswordHash(password, hash) {
		t.Error("CheckPasswordHash failed for correct password")
	}
	
	if CheckPasswordHash(wrongPassword, hash) {
		t.Error("CheckPasswordHash passed for wrong password")
	}
}

func TestGenerateToken(t *testing.T) {
	userID := uint(1)
	isAdmin := false
	
	token, err := GenerateToken(userID, isAdmin)
	if err != nil {
		t.Errorf("GenerateToken failed: %v", err)
	}
	
	if token == "" {
		t.Error("GenerateToken returned empty token")
	}
}

func TestParseToken(t *testing.T) {
	userID := uint(1)
	isAdmin := true
	
	token, err := GenerateToken(userID, isAdmin)
	if err != nil {
		t.Errorf("GenerateToken failed: %v", err)
	}
	
	claims, err := ParseToken(token)
	if err != nil {
		t.Errorf("ParseToken failed: %v", err)
	}
	
	parsedUserID := uint(claims["user_id"].(float64))
	parsedIsAdmin := claims["is_admin"].(bool)
	
	if parsedUserID != userID {
		t.Errorf("ParseToken returned wrong user_id: expected %d, got %d", userID, parsedUserID)
	}
	
	if parsedIsAdmin != isAdmin {
		t.Errorf("ParseToken returned wrong is_admin: expected %v, got %v", isAdmin, parsedIsAdmin)
	}
}

func TestParseToken_InvalidToken(t *testing.T) {
	invalidToken := "invalid.token.here"
	
	_, err := ParseToken(invalidToken)
	if err == nil {
		t.Error("ParseToken should have failed for invalid token")
	}
}
