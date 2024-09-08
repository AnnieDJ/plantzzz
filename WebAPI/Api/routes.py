from flask import Blueprint, request, jsonify
from .models import User, Score, Question
from . import db, bcrypt 
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
api = Blueprint('api', __name__)
from flask_cors import cross_origin  # 添加这个导入
import re

@api.route('/register', methods=['POST'])
@cross_origin(origins="http://localhost:5173", supports_credentials=True)
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    if len(password) < 8 or not any(char.isdigit() for char in password) \
            or not any(char.isupper() for char in password) \
            or not any(char.islower() for char in password):
        return jsonify({"message": "Password must be at least 8 characters, include a digit, and an uppercase letter, and one lowercase letter"}), 400

    # 检查邮箱格式是否包含 @example.com
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

@api.route('/login', methods=['POST'])
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
        print(f"User found------: {user.username}")
        
        # Generate the token
        access_token = create_access_token(identity=user.id)  # Using user ID as the identity
        print(f"Generated access token-----------: {access_token}")  # 打印生成的 token
         # Using user ID as the identity
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user_id": user.id , # Optionally return user ID
            "username": user.username  # Optionally return username
        }), 200
    else:
        # Handle wrong username/password
        return jsonify({"message": "Invalid username or password"}), 401

@api.route('/score', methods=['GET'])
@jwt_required()
def get_scores():
    user_id = get_jwt_identity()
    scores = Score.query.filter_by(user_id=user_id).all()
    return jsonify([score.to_dict() for score in scores]), 200

@api.route('/question', methods=['GET'])
@jwt_required()
def get_question():
    question = Question.query.first()  
    return jsonify(question.to_dict()), 200

@api.route('/answer', methods=['POST'])
@jwt_required()
def submit_answer():
    data = request.get_json()
    question = Question.query.get(data['question_id'])
    if question.correct_answer == data['answer']:
      
        return jsonify(message="Correct!"), 200
    return jsonify(message="Incorrect."), 400
