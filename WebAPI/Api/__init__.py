from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('Api.config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # 配置CORS，支持凭证
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

    from Api.routes import api
    app.register_blueprint(api, url_prefix='/api')  # 确保url_prefix正确



    return app
