# app/score/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Score, User_Answers, User
from .. import db
import logging

score_bp = Blueprint('score', __name__)

@score_bp.route('/', methods=['GET'])
@jwt_required()
def get_scores():
    user_id = get_jwt_identity()
    scores = Score.query.filter_by(user_id=user_id).all()
    return jsonify([score.to_dict() for score in scores]), 200

@score_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_score():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not user_id:
            return jsonify({"message": "Invalid user identity"}), 401

        if not isinstance(data, dict):
            return jsonify({"message": "Invalid data format"}), 400

        # Get and validate score fields
        try:
            total_single_score = int(data.get('TotalSingleScore', 0))
            total_true_false_score = int(data.get('TotalTrueFalseScore', 0))
            total_fill_blank_score = int(data.get('TotalFillBlankScore', 0))
        except (ValueError, TypeError) as ve:
            return jsonify({"message": "Invalid data types: Scores must be integers"}), 400

        # Ensure the user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Create a new UserAnswers record using the field names defined in the model
        new_answer = User_Answers(
            UserID=user_id,  # Use 'UserID' instead of 'user_id'
            TotalSingleScore=total_single_score,
            TotalTrueFalseScore=total_true_false_score,
            TotalFillBlankScore=total_fill_blank_score
        )

        db.session.add(new_answer)
        db.session.commit()

        return jsonify({"message": "Score submitted successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@score_bp.route('/calculate_total', methods=['POST'])
@jwt_required()
def calculate_total_score():
    try:
        # Start a new database transaction
        with db.session.begin():
            # Retrieve all users
            users = User.query.all()

            # Iterate through each user to calculate total scores
            for user in users:
                user_id = user.id

                # Get all User_Answers records for that user
                user_answers = User_Answers.query.filter_by(UserID=user_id).all()

                if not user_answers:
                    continue  # If the user has no answer records, skip

                # Calculate the total score for that user
                total_score = sum(
                    answer.TotalSingleScore + answer.TotalTrueFalseScore + answer.TotalFillBlankScore
                    for answer in user_answers
                )

                # Get or create Score record, ensuring a user only has one Score
                score_entry = Score.query.filter_by(UserID=user_id).first()
                if score_entry:
                    # If a record already exists, update the total score
                    score_entry.TotalScore = total_score
                else:
                    # Create a new Score record
                    score_entry = Score(UserID=user_id, TotalScore=total_score, Rank=0)
                    db.session.add(score_entry)

            # Get all user scores, sorted by total score in descending order
            all_scores = Score.query.order_by(Score.TotalScore.desc()).all()

            # Recalculate ranks
            current_rank = 1
            previous_score = None

            for i, entry in enumerate(all_scores):
                if previous_score is not None and entry.TotalScore < previous_score:
                    current_rank = i + 1
                entry.Rank = current_rank
                previous_score = entry.TotalScore

            # Commit database changes
            db.session.commit()

    except Exception as e:
        db.session.rollback()
        logging.exception("Error calculating total score and updating ranks")
        return jsonify({"message": f"Error calculating total score and updating ranks: {str(e)}"}), 500

    return jsonify({"message": "Total score and ranks updated successfully"}), 200


@score_bp.route('/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    try:
        # Get all user scores, sorted by total score in descending order
        all_scores = Score.query.order_by(Score.TotalScore.desc()).all()

        leaderboard = []
        for entry in all_scores:
            user = User.query.get(entry.UserID)
            if user:
                leaderboard.append({
                    "user_id": user.id,
                    "name": user.username,
                    "email": user.email,
                    "total_score": entry.TotalScore,
                    "rank": entry.Rank
                })

        return jsonify({"leaderboard": leaderboard}), 200

    except Exception as e:
        logging.exception(f"Error fetching leaderboard: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
