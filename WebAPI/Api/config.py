import os

class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:##root2024@database1.c7amaae0edxa.ap-southeast-2.rds.amazonaws.com/PlantZZZ'
   # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:##root2024@database1.c7amaae0edxa.ap-southeast-2.rds.amazonaws.com/PlantZZZ'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your_jwt_secret_key'
    
        # 启用 SQLAlchemy 的调试模式
    SQLALCHEMY_ECHO = True
# 文件上传配置
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads', 'avatars')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 限制上传文件大小为16MB
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}