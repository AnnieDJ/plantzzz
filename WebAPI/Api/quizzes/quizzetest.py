# app/quizzes/true_false.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Question
from .. import db
import random
from collections import defaultdict

quizzetest_bp = Blueprint('quizzetest', __name__)

@quizzetest_bp.route('/train-questions', methods=['GET'])
def get_train_questions_by_term():
    term = request.args.get('term')  # Get the Term value from URL parameters

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # Validate if term is a valid code
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # Query all questions matching the term value
        questions = Question.query.filter_by(Term=term).all()

        if not questions:
            return jsonify({"message": "No questions found for this term"}), 404

        # Get all distinct correct answers within the same term
        all_correct_answers = set(
            row[0] for row in db.session.query(Question.CorrectAnswer).filter_by(Term=term).distinct()
        )

        result = []
        for question in questions:
            # Exclude the correct answer of the current question from the pool
            other_correct_answers = list(all_correct_answers - {question.CorrectAnswer})

            # Randomly select 3 incorrect options from the same term
            if len(other_correct_answers) >= 3:
                wrong_options = random.sample(other_correct_answers, 3)
            else:
                # If not enough wrong options, use whatever is available
                wrong_options = other_correct_answers

            # Add the correct answer
            options = wrong_options + [question.CorrectAnswer]

            # Shuffle the options
            random.shuffle(options)

            # Prepare the question data
            question_data = {
                'QuestionContent': question.QuestionContent,
                'PlantImages': question.PlantImages,  # Use PlantImages field
                'Options': options,
                'CorrectAnswer': question.CorrectAnswer  # Include if needed on frontend
            }

            result.append(question_data)

        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()  # Add database rollback
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
