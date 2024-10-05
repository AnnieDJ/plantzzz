# app/auth/routes.py
from flask import Blueprint, request, jsonify
from ..models import User
from .. import db
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash
import re
from flask_cors import cross_origin
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
# @cross_origin(origins="http://localhost:5173", supports_credentials=True)
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not username or not email or not password or not confirm_password:
        return jsonify({"message": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    if len(password) < 8 or not any(char.isdigit() for char in password) \
            or not any(char.isupper() for char in password) \
            or not any(char.islower() for char in password):
        return jsonify({"message": "Password must be at least 8 characters, include a digit, an uppercase letter, and a lowercase letter"}), 400

    # Check if the email format includes @example.com
    if not re.match(r"^[\w\.-]+@example\.com$", email):
        return jsonify({"message": "Email must be in the format of 'yourname@example.com'"}), 400
    
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        if existing_user.username == username:
            return jsonify({"message": "Username already exists"}), 409
        if existing_user.email == email:
            return jsonify({"message": "Email already exists"}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)  # Hashes the password and stores it

    try:
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Database error, please try again"}), 500

    return jsonify({"message": "Registration successful"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check for missing username or password
    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # Retrieve user from the database by username
    user = User.query.filter_by(username=username).first()

    # Check if user exists and the password is correct
    if user and check_password_hash(user.hashed_password, password):
        # Generate the token
        access_token = create_access_token(identity=user.id) 
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user_id": user.id, 
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }), 200
    else:
        # Handle wrong username/password
        return jsonify({"message": "Invalid username or password"}), 401

@auth_bp.route('/change_password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        new_password = data.get('new_password')

        if not new_password:
            return jsonify({"message": "New password is required"}), 400

        # Validate if the new password meets the criteria
        if len(new_password) < 8 or not any(char.isdigit() for char in new_password) \
                or not any(char.isupper() for char in new_password) \
                or not any(char.islower() for char in new_password):
            return jsonify({"message": "New password must be at least 8 characters long, include a digit, an uppercase letter, and a lowercase letter"}), 400

        # Retrieve the current user from the database
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Check if the new password is the same as the old password
        if user.check_password(new_password):
            return jsonify({"message": "New password cannot be the same as the old password"}), 400

        # Set the new password (hashes the new password and saves it)
        user.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "Password changed successfully"}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Database error, please try again"}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred"}), 500

@auth_bp.route('/upload_avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    from flask import current_app
    from werkzeug.utils import secure_filename
    from ..utils import allowed_file

    user_id = get_jwt_identity()

    if 'avatar' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['avatar']

    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create a unique filename
        filename = f"user_{user_id}_{filename}"
        # Get the upload folder path
        upload_folder = current_app.config['UPLOAD_FOLDER']
        # Ensure the upload folder exists
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        try:
            # Update the user's image field
            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "User not found"}), 404

            user.image = f"/static/uploads/avatars/{filename}"  # Update the field
            db.session.commit()
            return jsonify({"avatar_url": user.image}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Database error: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid file type"}), 400

@auth_bp.route('/get_avatar', methods=['GET'])
@jwt_required()
def get_avatar():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.image:
        return jsonify({"avatar_url": user.image}), 200
    else:
        return jsonify({"avatar_url": ""}), 200
