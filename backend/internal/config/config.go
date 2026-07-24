package config

import (
	"os"
	"time"
)

type Config struct {
	ServerPort     string
	MongoURI       string
	MongoDatabase  string
	JWTSecret      string
	JWTExpiry      time.Duration
	RefreshExpiry  time.Duration
	UploadDir      string
	MaxUploadSize  int64
	CORSAllowed    []string
	RateLimitRPS   int
	RateLimitBurst int
}

func Load() *Config {
	return &Config{
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		MongoURI:       getEnv("MONGO_URI", "mongodb://localhost:27017"),
		MongoDatabase:  getEnv("MONGO_DATABASE", "eip_platform"),
		JWTSecret:      getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
		JWTExpiry:      time.Hour * 24,
		RefreshExpiry:  time.Hour * 24 * 7,
		UploadDir:      getEnv("UPLOAD_DIR", "./uploads"),
		MaxUploadSize:  5 * 1024 * 1024, // 5MB
		CORSAllowed:    []string{"http://localhost:3000", "http://localhost:5173"},
		RateLimitRPS:   100,
		RateLimitBurst:  200,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
