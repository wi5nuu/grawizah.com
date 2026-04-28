package interfaces

import "context"

// AIProvider interface - implements Polymorphism
// Different AI providers (Groq, OpenAI, etc.) implement this interface
type AIProvider interface {
	Name() string
	IsAvailable(ctx context.Context) bool
	Call(ctx context.Context, prompt string, options map[string]interface{}) (string, error)
}

// AIService interface - different AI features implement this
type AIService interface {
	Analyze(ctx context.Context, input interface{}) (interface{}, error)
}
