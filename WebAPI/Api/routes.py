from flask import Blueprint, request, jsonify, current_app
from .models import User, Score, Question
from . import db
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from flask_cors import cross_origin
import os
import re
import logging
from .utils import allowed_file
from sqlalchemy.sql.expression import func
import random
from collections import defaultdict

logging.basicConfig(level=logging.INFO)

api = Blueprint('api', __name__)

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
 
               
         # Using user ID as the identity
# 打印生成的 token
         # Using user ID as the identity
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user_id": user.id , # Optionally return user ID
            "username": user.username  ,# Optionally return username
            "email":user.email,
            "role": user.role,
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



@api.route('/train-questions', methods=['GET'])
def get_train_questions_by_term():
    term = request.args.get('term')  # 从URL参数获取Term值

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # 验证term是否为有效的数字代码
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # 查询所有符合term值的questions
        questions = Question.query.filter_by(Term=term).all()

        if not questions:
            return jsonify({"message": "No questions found for this term"}), 404

        # 将所有问题转换为字典形式返回
        return jsonify([question.to_dict() for question in questions]), 200
    except Exception as e:
        db.session.rollback()  # 添加数据库回滚
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500



@api.route('/answer', methods=['POST'])
@jwt_required()
def submit_answer():
    data = request.get_json()
    question = Question.query.get(data['question_id'])
    if question.correct_answer == data['answer']:
      
        return jsonify(message="Correct!"), 200
    return jsonify(message="Incorrect."), 400


@api.route('/change_password', methods=['POST'])
@jwt_required()  # 需要登录才能修改密码
def change_password():
    try:
        user_id = get_jwt_identity()  # 获取当前用户的身份
        logging.info(f"User ID: {user_id}")

        data = request.get_json()
        logging.info(f"Request Data: {data}")
        
        new_password = data.get('new_password')

        if not new_password:
            logging.error("New password is required")
            return jsonify({"message": "New password is required"}), 400

        # 验证新密码是否符合规则
        if len(new_password) < 8 or not any(char.isdigit() for char in new_password) \
                or not any(char.isupper() for char in new_password) \
                or not any(char.islower() for char in new_password):
            logging.error("New password does not meet the requirements")
            return jsonify({"message": "New password must be at least 8 characters long, include a digit, an uppercase letter, and a lowercase letter"}), 400

        # 从数据库获取当前用户
        user = User.query.get(user_id)
        if not user:
            logging.error("User not found")
            return jsonify({"message": "User not found"}), 404

        # 检查新密码是否和旧密码相同
        if user.check_password(new_password):
            logging.error("New password cannot be the same as the old password")
            return jsonify({"message": "New password cannot be the same as the old password"}), 400

        # 设置新密码（将新密码进行哈希处理并保存）
        user.set_password(new_password)
        logging.info("Setting new password successfully")

        db.session.commit()
        logging.info("password changed successfully")
        return jsonify({"message": "Password changed successfully"}), 200

    except IntegrityError:
        logging.exception("Database error")
        db.session.rollback()
        return jsonify({"message": "Database error, please try again"}), 500

    except Exception as e:
        logging.exception("password change failed")
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred"}), 500
    

@api.route('/upload_avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()

    if 'avatar' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['avatar']

    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # 创建唯一的文件名
        filename = f"user_{user_id}_{filename}"
        # 获取上传文件夹路径
        upload_folder = current_app.config['UPLOAD_FOLDER']
        # 确保上传文件夹存在
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # 打印文件路径，确保路径正确
        print(f"File saved to: {file_path}")

        try:
            # 更新用户的 images 字段
            user = User.query.get(user_id)  # 获取用户对象
            if not user:
                return jsonify({"message": "User not found"}), 404

            user.image = f"/static/uploads/avatars/{filename}"  # 更新字段

            # 打印调试信息，确认更改的字段
            print(f"Attempting to update user.images to: {user.image}")
            
            db.session.commit()  # 提交到数据库
            
            print(f"Successfully committed. User image path in DB: {user.image}")
            return jsonify({"avatar_url": user.image}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error committing to DB: {e}")
            return jsonify({"message": f"Database error: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid file type"}), 400



    
@api.route('/get_avatar', methods=['GET'])
@jwt_required()
def get_avatar():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user and user.image:
        return jsonify({"avatar_url": user.image}), 200
    else:
        return jsonify({"avatar_url": ""}), 200
    


@api.route('/single-choice-questions', methods=['GET'])
def get_single_choice_questions_by_term():
    term = request.args.get('term')  # 从URL参数获取Term值

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # 验证term是否为有效的数字代码
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # 查询所有符合term值的单选题，乱序并限制结果数量
        questions_query = Question.query.filter_by(Term=term, QuestionType='Single')
        questions = questions_query.order_by(func.random()).limit(50).all()

        if not questions:
            return jsonify({"message": "No single-choice questions found for this term"}), 404

        # 随机选择50个问题，以避免重复和提供不同的问题集合
        questions_sample = random.sample(questions, min(len(questions), 30))

        # 将所有问题转换为字典形式返回
        return jsonify([question.to_dict() for question in questions_sample]), 200
    except Exception as e:
        db.session.rollback()  # 在发生异常时进行数据库回滚
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@api.route('/Blank-Filling-Quiz', methods=['GET'])
def get_Blank_Filling_Quiz_by_term():
    term = request.args.get('term')  # 从URL参数获取Term值

    if not term:
        return jsonify({"message": "Term is required"}), 400

    # 验证term是否为有效的数字代码
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # 查询所有符合term值的单选题，乱序并限制结果数量
        questions_query = Question.query.filter_by(Term=term, QuestionType='Single')
        questions = questions_query.order_by(func.random()).limit(50).all()

        if not questions:
            return jsonify({"message": "No single-choice questions found for this term"}), 404

        # 随机选择50个问题，以避免重复和提供不同的问题集合
        questions_sample = random.sample(questions, min(len(questions), 30))

        # 将所有问题转换为字典形式返回
        return jsonify([question.to_dict() for question in questions_sample]), 200
    except Exception as e:
        db.session.rollback()  # 在发生异常时进行数据库回滚
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    


@api.route('/True-Or-False-Quiz', methods=['GET'])
def get_true_or_false_quiz_by_term():
    # 从请求参数中获取 'term'
    term = request.args.get('term')

    # 如果没有提供 'term'，返回错误信息
    if not term:
        return jsonify({"message": "Term is required"}), 400

    # 验证提供的 'term' 是否有效
    valid_terms = ['2110101', '2110102', '206201', '206202']
    if term not in valid_terms:
        return jsonify({"message": "Invalid term code"}), 400

    try:
        # 根据指定的 'term' 从数据库中获取所有相关的问题
        question_entries = Question.query.filter_by(Term=term).all()

        # 如果没有找到相关的问题，返回错误信息
        if not question_entries:
            return jsonify({"message": "No questions found for this term"}), 404

        # 构建一个映射：将每个 PlantImages 映射到其对应的所有 CorrectAnswer 集合
        plant_images_to_correct_answers = defaultdict(set)
        for question in question_entries:
            plant_images_to_correct_answers[question.PlantImages].add(question.CorrectAnswer)

        # 获取所有可能的正确答案集合
        all_correct_answers = set(q.CorrectAnswer for q in question_entries)

        # 获取指定 'term' 中所有的 PlantImages 列表
        plant_images_list = list(plant_images_to_correct_answers.keys())

        num_questions = 30  # 需要生成的题目数量

        # 如果图片数量不足 30，允许重复选择图片
        if len(plant_images_list) >= num_questions:
            # 随机选择 30 张不重复的图片
            selected_images = random.sample(plant_images_list, num_questions)
        else:
            # 有放回地随机选择图片，直到数量达到 30
            selected_images = random.choices(plant_images_list, k=num_questions)

        true_false_questions = []  # 存储生成的题目列表

        # 遍历选定的图片，生成对应的题目
        for plant_image in selected_images:
            # 获取该图片对应的正确答案集合
            correct_answers_for_image = plant_images_to_correct_answers[plant_image]

            # 随机决定题目的正确答案是 True 还是 False
            correct_answer = random.choice([True, False])

            if correct_answer:
                # 如果正确答案是 True，从当前图片的正确答案中选择 showplant
                showplant = random.choice(list(correct_answers_for_image))
            else:
                # 如果正确答案是 False，从所有不属于当前图片正确答案的植物名称中选择 showplant
                incorrect_answers = all_correct_answers - correct_answers_for_image
                if not incorrect_answers:
                    # 如果没有错误答案可选，继续下一次循环
                    continue
                showplant = random.choice(list(incorrect_answers))

            # 构建题目文本
            question_text = f"This is {showplant}."

            # 将题目信息添加到列表中
            true_false_questions.append({
                'question': question_text,
                'image_id': plant_image,
                'correct_answer': correct_answer
            })

        # 如果生成的题目数量不足 30，再次随机补充
        while len(true_false_questions) < num_questions:
            true_false_questions.append(random.choice(true_false_questions))

        # 返回生成的 30 道判断正误题
        return jsonify(true_false_questions[:num_questions]), 200

    except Exception as e:
        # 发生异常时回滚数据库事务
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
