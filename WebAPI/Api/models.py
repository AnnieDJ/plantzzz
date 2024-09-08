from . import db
from werkzeug.security import generate_password_hash

class User(db.Model):
    __tablename__ = 'Users'  # 匹配数据库中的表名

    id = db.Column(db.Integer, primary_key=True, name='UserID')
    username = db.Column(db.String(255), unique=True, nullable=False, name='Username')
    email = db.Column(db.String(255), unique=True, nullable=False, name='Email')
    hashed_password = db.Column(db.String(255), nullable=False, name='HashedPassword')
    role = db.Column(db.Enum('User', 'Admin'), default='User', nullable=False, name='Role')

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)


class Score(db.Model):
    __tablename__ = 'Scores'  # 假设这个表的名字也是这样
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    score = db.Column(db.Integer, nullable=False)


class Question(db.Model):
    __tablename__ = 'Questions'  # 假设这个表的名字也是这样
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.String(200), nullable=False)
    is_true_false = db.Column(db.Boolean, default=False)
    correct_answer = db.Column(db.String(100), nullable=False)
