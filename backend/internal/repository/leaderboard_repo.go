package repository

import (
	"database/sql"
	"github.com/grawizah/backend/internal/models"
)

// LeaderboardRepository implements the Repository interface for LeaderboardScore
type LeaderboardRepository struct {
	db *sql.DB
}

// NewLeaderboardRepository creates a new leaderboard repository
func NewLeaderboardRepository(db *sql.DB) *LeaderboardRepository {
	return &LeaderboardRepository{db: db}
}

// Create inserts a new leaderboard score
func (r *LeaderboardRepository) Create(score *models.LeaderboardScore) error {
	query := `
		INSERT INTO leaderboard_scores (
			id, company_id, conversion_rate, repeat_buyer_rate, response_rate,
			buyer_rating, catalog_completeness, fulfillment_success, total_score,
			rank, trend_7d, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	`
	
	_, err := r.db.Exec(query,
		score.ID, score.CompanyID, score.ConversionRate, score.RepeatBuyerRate,
		score.ResponseRate, score.BuyerRating, score.CatalogCompleteness,
		score.FulfillmentSuccess, score.TotalScore, score.Rank, score.Trend7d,
		score.CreatedAt, score.UpdatedAt,
	)
	
	return err
}

// GetByID retrieves a leaderboard score by ID
func (r *LeaderboardRepository) GetByID(id string) (*models.LeaderboardScore, error) {
	query := `
		SELECT id, company_id, conversion_rate, repeat_buyer_rate, response_rate,
			buyer_rating, catalog_completeness, fulfillment_success, total_score,
			COALESCE(rank, 0), COALESCE(trend_7d, 0), created_at, updated_at
		FROM leaderboard_scores
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	score := &models.LeaderboardScore{}
	err := r.db.QueryRow(query, id).Scan(
		&score.ID, &score.CompanyID, &score.ConversionRate, &score.RepeatBuyerRate,
		&score.ResponseRate, &score.BuyerRating, &score.CatalogCompleteness,
		&score.FulfillmentSuccess, &score.TotalScore, &score.Rank, &score.Trend7d,
		&score.CreatedAt, &score.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	return score, err
}

// GetByCompanyID retrieves a leaderboard score by company ID
func (r *LeaderboardRepository) GetByCompanyID(companyID string) (*models.LeaderboardScore, error) {
	r.syncMissingCompanies()
	query := `
		SELECT id, company_id, conversion_rate, repeat_buyer_rate, response_rate,
			buyer_rating, catalog_completeness, fulfillment_success, total_score,
			COALESCE(rank, 0), COALESCE(trend_7d, 0), created_at, updated_at
		FROM leaderboard_scores
		WHERE company_id = $1 AND deleted_at IS NULL
	`
	
	score := &models.LeaderboardScore{}
	err := r.db.QueryRow(query, companyID).Scan(
		&score.ID, &score.CompanyID, &score.ConversionRate, &score.RepeatBuyerRate,
		&score.ResponseRate, &score.BuyerRating, &score.CatalogCompleteness,
		&score.FulfillmentSuccess, &score.TotalScore, &score.Rank, &score.Trend7d,
		&score.CreatedAt, &score.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	return score, err
}

// GetAll retrieves all leaderboard scores ordered by rank
func (r *LeaderboardRepository) GetAll(limit, offset int) ([]models.LeaderboardScore, error) {
	r.syncMissingCompanies()
	query := `
		SELECT ls.id, ls.company_id, ls.conversion_rate, ls.repeat_buyer_rate,
			ls.response_rate, ls.buyer_rating, ls.catalog_completeness,
			ls.fulfillment_success, ls.total_score, COALESCE(ls.rank, 0), COALESCE(ls.trend_7d, 0),
			ls.created_at, ls.updated_at, c.name as company_name, c.country, COALESCE(c.logo_url, '') as logo_url
		FROM leaderboard_scores ls
		LEFT JOIN companies c ON ls.company_id = c.id
		WHERE ls.deleted_at IS NULL
		ORDER BY ls.total_score DESC
		LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var scores []models.LeaderboardScore
	for rows.Next() {
		var s models.LeaderboardScore
		err := rows.Scan(
			&s.ID, &s.CompanyID, &s.ConversionRate, &s.RepeatBuyerRate,
			&s.ResponseRate, &s.BuyerRating, &s.CatalogCompleteness,
			&s.FulfillmentSuccess, &s.TotalScore, &s.Rank, &s.Trend7d,
			&s.CreatedAt, &s.UpdatedAt, &s.CompanyName, &s.Country, &s.LogoURL,
		)
		if err != nil {
			return nil, err
		}
		scores = append(scores, s)
	}
	
	return scores, nil
}

// Update updates an existing leaderboard score
func (r *LeaderboardRepository) Update(score *models.LeaderboardScore) error {
	query := `
		UPDATE leaderboard_scores SET
			conversion_rate = $2, repeat_buyer_rate = $3, response_rate = $4,
			buyer_rating = $5, catalog_completeness = $6, fulfillment_success = $7,
			total_score = $8, rank = $9, trend_7d = $10, updated_at = $11
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	result, err := r.db.Exec(query,
		score.ID, score.ConversionRate, score.RepeatBuyerRate, score.ResponseRate,
		score.BuyerRating, score.CatalogCompleteness, score.FulfillmentSuccess,
		score.TotalScore, score.Rank, score.Trend7d, score.UpdatedAt,
	)
	
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return models.ErrNotFound
	}
	
	return nil
}

// Delete soft deletes a leaderboard score
func (r *LeaderboardRepository) Delete(id string) error {
	query := `UPDATE leaderboard_scores SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return models.ErrNotFound
	}
	
	return nil
}

// GetTopPerformers retrieves the top N performers
func (r *LeaderboardRepository) GetTopPerformers(limit int) ([]models.LeaderboardScore, error) {
	r.syncMissingCompanies()
	query := `
		SELECT ls.id, ls.company_id, ls.conversion_rate, ls.repeat_buyer_rate,
			ls.response_rate, ls.buyer_rating, ls.catalog_completeness,
			ls.fulfillment_success, ls.total_score, COALESCE(ls.rank, 0), COALESCE(ls.trend_7d, 0),
			ls.created_at, ls.updated_at, c.name as company_name, c.country, COALESCE(c.logo_url, '') as logo_url
		FROM leaderboard_scores ls
		LEFT JOIN companies c ON ls.company_id = c.id
		WHERE ls.deleted_at IS NULL
		ORDER BY ls.total_score DESC
		LIMIT $1
	`
	
	rows, err := r.db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var scores []models.LeaderboardScore
	for rows.Next() {
		var s models.LeaderboardScore
		err := rows.Scan(
			&s.ID, &s.CompanyID, &s.ConversionRate, &s.RepeatBuyerRate,
			&s.ResponseRate, &s.BuyerRating, &s.CatalogCompleteness,
			&s.FulfillmentSuccess, &s.TotalScore, &s.Rank, &s.Trend7d,
			&s.CreatedAt, &s.UpdatedAt, &s.CompanyName, &s.Country, &s.LogoURL,
		)
		if err != nil {
			return nil, err
		}
		scores = append(scores, s)
	}
	
	return scores, nil
}

// RecalculateRanks recalculates ranks for all companies
func (r *LeaderboardRepository) RecalculateRanks() error {
	query := `
		WITH ranked AS (
			SELECT id, ROW_NUMBER() OVER (ORDER BY total_score DESC) as new_rank
			FROM leaderboard_scores
			WHERE deleted_at IS NULL
		)
		UPDATE leaderboard_scores ls
		SET rank = r.new_rank, updated_at = NOW()
		FROM ranked r
		WHERE ls.id = r.id
	`
	
	_, err := r.db.Exec(query)
	return err
}

// GetCompanyRank retrieves the rank of a specific company
func (r *LeaderboardRepository) GetCompanyRank(companyID string) (int, error) {
	query := `
		SELECT COALESCE(rank, 0)
		FROM leaderboard_scores
		WHERE company_id = $1 AND deleted_at IS NULL
	`
	
	var rank int
	err := r.db.QueryRow(query, companyID).Scan(&rank)
	if err == sql.ErrNoRows {
		return 0, models.ErrNotFound
	}
	
	return rank, err
}

// syncMissingCompanies automatically populates leaderboard_scores with newly registered companies in real-time
func (r *LeaderboardRepository) syncMissingCompanies() {
	syncQuery := `
		INSERT INTO leaderboard_scores (id, company_id, conversion_rate, repeat_buyer_rate, response_rate, buyer_rating, catalog_completeness, fulfillment_success, total_score, rank, trend_7d, created_at, updated_at)
		SELECT 
			uuid_generate_v4(), 
			id, 
			38.5, 
			45.0, 
			95.0, 
			4.5, 
			80, 
			98.5, 
			85.0, 
			0, 
			0, 
			NOW(), 
			NOW()
		FROM companies
		WHERE id NOT IN (SELECT company_id FROM leaderboard_scores WHERE deleted_at IS NULL)
		ON CONFLICT DO NOTHING
	`
	_, _ = r.db.Exec(syncQuery)
	_ = r.RecalculateRanks()
}
