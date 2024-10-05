# app/quizzes/single_choice.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..models import Question
from .. import db
import random

single_choice_bp = Blueprint('single_choice_quizzes', __name__)

@single_choice_bp.route('/single-choice', methods=['GET'])
def get_single_choice_questions_by_term():
    term = request.args.get('term')  # Get the Term value from URL parameters

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # Validate if term is a valid numeric code
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # Query all single-choice questions that match the term value
        questions_query = Question.query.filter_by(Term=term)
        questions = questions_query.all()

        if not questions:
            return jsonify({"message": "No single-choice questions found for this term"}), 404

        # Randomly select 30 questions from all matching questions to avoid duplicates
        questions_sample = random.sample(questions, min(len(questions), 30))

        # Get all distinct correct answers within the same Term
        all_correct_answers = set(
            row[0] for row in db.session.query(Question.CorrectAnswer).filter_by(Term=term).distinct()
        )

        result = []
        for question in questions_sample:
            # Exclude the correct answer of the current question
            other_correct_answers = list(all_correct_answers - {question.CorrectAnswer})

            # Randomly select 3 incorrect options
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
                'PlantImages': question.PlantImages,
                'Options': options,
                'CorrectAnswer': question.CorrectAnswer
            }

            result.append(question_data)

        return jsonify(result), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
