from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from ..models import Question
from .. import db
from werkzeug.utils import secure_filename
from ..utils import allowed_file
import os

admin_bp = Blueprint('admin', __name__)

# Admin - Get question data
@admin_bp.route('/logged_home', methods=['GET'])
@jwt_required()
def admin_logged_home():
    term = request.args.get('term')

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # Validate term
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        term_int = int(term)
        questions = Question.query.filter_by(Term=term_int).all()

        if not questions:
            return jsonify([]), 200  # If no data, return an empty list

        data = []
        for question in questions:
            data.append({
                'QuestionID': question.QuestionID,
                'QuestionContent': question.QuestionContent,
                'CorrectAnswer': question.CorrectAnswer,
                'PlantImages': question.PlantImages,
            })

        return jsonify(data), 200
    except ValueError:
        return jsonify({"message": "Invalid term code format"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Add new question
@admin_bp.route('/add_question', methods=['POST'])
@jwt_required()
def add_question():
    term = request.form.get('term')
    question_content = request.form.get('questionContent')
    correct_answer = request.form.get('correctAnswer')

    if 'image' not in request.files:
        return jsonify({"message": "No image file provided"}), 400

    image_file = request.files['image']

    if not allowed_file(image_file.filename):
        return jsonify({"message": "Invalid image file type"}), 400

    original_filename = secure_filename(image_file.filename)

    save_path = os.path.join(current_app.config['UPLOAD_FOLDER_PLANT'], original_filename)  # Save file using original filename
    image_file.save(save_path)
    
    try:
        question = Question(
            Term=int(term),
            QuestionContent=question_content,
            CorrectAnswer=correct_answer,
            PlantImages=original_filename  
        )
        db.session.add(question)
        db.session.commit()
        return jsonify({"message": "New question added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Update question image
@admin_bp.route('/update_image/<int:question_id>', methods=['PUT'])
@jwt_required()
def update_image(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({'message': 'Question not found'}), 404

    if 'image' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        # Create a unique filename
        filename = f"{original_filename}"
        upload_folder = current_app.config['UPLOAD_FOLDER_PLANT']  # Upload to plantPic folder
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        
        try:
            # Delete the old image file (if it exists)
            old_image_filename = question.PlantImages
            old_image_path = os.path.join(upload_folder, old_image_filename)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)
                current_app.logger.info(f"Deleted old image file: {old_image_path}")
            else:
                current_app.logger.warning(f"Old image file not found: {old_image_path}")
        except Exception as e:
            current_app.logger.error(f"Error deleting old image file: {str(e)}")
            return jsonify({"message": f"Error deleting old image file: {str(e)}"}), 500

        # Save the new image file
        file.save(file_path)

        try:
            # Update the question's PlantImages field with the new filename
            question.PlantImages = filename
            db.session.commit()
            return jsonify({"new_plant_image_url": filename}), 200
        except Exception as e:
            db.session.rollback()
            # If the database update fails, delete the newly uploaded image file
            if os.path.exists(file_path):
                os.remove(file_path)
                current_app.logger.info(f"Deleted new image file due to DB error: {file_path}")
            return jsonify({"message": f"Database error: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid file type"}), 400

# Delete question
@admin_bp.route('/delete_question/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "Question not found"}), 404

    # Get the image filename
    image_filename = question.PlantImages

    # Build the full path for the image file
    upload_folder = current_app.config['UPLOAD_FOLDER_PLANT']
    image_path = os.path.join(upload_folder, image_filename)

    try:
        # Delete the image file (if it exists)
        if os.path.exists(image_path):
            os.remove(image_path)
            current_app.logger.info(f"Deleted image file: {image_path}")
        else:
            current_app.logger.warning(f"Image file not found: {image_path}")

        # Delete the database record
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question and associated image deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting question or image: {str(e)}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
