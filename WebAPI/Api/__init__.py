from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import logging

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('Api.config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # config CORS，supply credentials
    CORS(app, resources={
        r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True},
        r"/static/*": {"origins": "http://localhost:5173"}  
        # allow front end to access static files
    })

    # old route
    # from Api.routes import api
    # app.register_blueprint(api, url_prefix='/api')  # 确保url_prefix正确

    from .auth.routes import auth_bp
    from .quizzes.single_choice import single_choice_bp
    from .quizzes.true_false import true_false_bp
    from .quizzes.blank_filling import blank_filling_bp
    from .quizzes.quizzetest import quizzetest_bp
    from .users.routes import users_bp
    from .admin.routes import admin_bp
    from .score.routes import score_bp

    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(single_choice_bp, url_prefix='/api/single-choice-quizzes')
    app.register_blueprint(true_false_bp, url_prefix='/api/true-false')
    app.register_blueprint(blank_filling_bp, url_prefix='/api/blank-filling-quizzes')
    app.register_blueprint(quizzetest_bp, url_prefix='/api/quizzes/quizzetest')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(score_bp, url_prefix='/api/score')

    return app
