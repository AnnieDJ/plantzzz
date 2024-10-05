import os
from datetime import timedelta

class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:##root2024@database1.c7amaae0edxa.ap-southeast-2.rds.amazonaws.com/PlantZZZ'
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:##root2024@database1.c7amaae0edxa.ap-southeast-2.rds.amazonaws.com/PlantZZZ'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your_jwt_secret_key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=50)  # Set Access Token expiration time to 50 minutes
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)     # Set Refresh Token expiration time to 30 days
    
    # Enable SQLAlchemy debug mode
    SQLALCHEMY_ECHO = True

    # File upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads', 'avatars')
    UPLOAD_FOLDER_PLANT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'Client', 'src', 'assets', 'plantPic'))  # Change to absolute path
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # Limit upload file size to 10MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
