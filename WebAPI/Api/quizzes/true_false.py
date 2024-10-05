# app/quizzes/true_false.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from collections import defaultdict
from ..models import Question
from .. import db
import random

true_false_bp = Blueprint('true_false_quizzes', __name__)

@true_false_bp.route('/get-true-false-questions', methods=['GET'])
def get_true_or_false_quiz_by_term():
    term = request.args.get('term')

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # Validate if term is a valid numeric code
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # Retrieve all relevant questions from the database based on the specified 'term' and 'QuestionType'
        question_entries = Question.query.filter_by(Term=term).all()

        if not question_entries:
            return jsonify({"message": "No true/false questions found for this term"}), 404

        # Build a mapping: map each PlantImages to its corresponding set of CorrectAnswers
        plant_images_to_correct_answers = defaultdict(set)
        for question in question_entries:
            plant_images_to_correct_answers[question.PlantImages].add(question.CorrectAnswer)

        # Get all possible correct answers set
        all_correct_answers = set(q.CorrectAnswer for q in question_entries)

        # Get the list of all PlantImages for the specified 'term'
        plant_images_list = list(plant_images_to_correct_answers.keys())

        num_questions = 30  # The number of questions to generate

        # If the number of images is less than 30, allow duplicate selection of images
        if len(plant_images_list) >= num_questions:
            # Randomly select 30 unique images
            selected_images = random.sample(plant_images_list, num_questions)
        else:
            # Randomly select images with replacement until the number reaches 30
            selected_images = random.choices(plant_images_list, k=num_questions)

        true_false_questions = []  # List to store generated questions

        # Iterate over selected images to generate corresponding questions
        for plant_image in selected_images:
            # Get the set of correct answers for this image
            correct_answers_for_image = plant_images_to_correct_answers[plant_image]

            # Randomly decide if the correct answer is True or False
            correct_answer = random.choice([True, False])

            if correct_answer:
                # If the correct answer is True, choose a correct answer from the current image's correct answers
                showplant = random.choice(list(correct_answers_for_image))
            else:
                # If the correct answer is False, choose a plant name that is not in the current image's correct answers
                incorrect_answers = all_correct_answers - correct_answers_for_image
                if not incorrect_answers:
                    # If there are no incorrect answers to choose from, continue to the next iteration
                    continue
                showplant = random.choice(list(incorrect_answers))

            # Construct the question text
            question_text = f"This is {showplant}."

            # Add the question information to the list
            true_false_questions.append({
                'question': question_text,
                'image_id': plant_image,
                'correct_answer': correct_answer
            })

        # If the generated number of questions is less than 30, randomly supplement
        while len(true_false_questions) < num_questions:
            true_false_questions.append(random.choice(true_false_questions))

        # Return the generated 30 true/false questions
        return jsonify(true_false_questions[:num_questions]), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
