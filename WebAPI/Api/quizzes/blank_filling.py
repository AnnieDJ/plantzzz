# app/quizzes/blank_filling.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Question
from .. import db
import random
from sqlalchemy.sql.expression import func

blank_filling_bp = Blueprint('blank_filling_quizzes', __name__)

@blank_filling_bp.route('/blank-filling-quizzes', methods=['GET'])
def get_blank_filling_quiz_by_term():
    term = request.args.get('term')  # Get the Term value from URL parameters

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # Validate if term is a valid numeric code
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # Query all blank-filling questions that match the term value, shuffle and limit the number of results
        questions_query = Question.query.filter_by(Term=term)
        questions = questions_query.order_by(func.random()).limit(30).all()

        if not questions:
            return jsonify({"message": "No blank-filling questions found for this term"}), 404

        # Randomly select 30 questions to avoid duplicates and provide different question sets
        questions_sample = random.sample(questions, min(len(questions), 30))

        # Convert all questions to dictionary format and return
        return jsonify([question.to_dict() for question in questions_sample]), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
