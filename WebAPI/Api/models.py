from . import db
from werkzeug.security import generate_password_hash, check_password_hash  # 导入 check_password_hash

class User(db.Model):
    __tablename__ = 'Users'  # 匹配数据库中的表名

    id = db.Column(db.Integer, primary_key=True, name='UserID')
    username = db.Column(db.String(255), unique=True, nullable=False, name='Username')
    email = db.Column(db.String(255), unique=True, nullable=False, name='Email')
    hashed_password = db.Column(db.String(255), nullable=False, name='HashedPassword')
    role = db.Column(db.Enum('User', 'Admin'), default='User', nullable=False, name='Role')
    image = db.Column(db.String(255), nullable=True, name='Images')  # Path to the image file
    
    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)


class Score(db.Model):
    __tablename__ = 'Scores'  # 假设这个表的名字也是这样
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    score = db.Column(db.Integer, nullable=False)


class Question(db.Model):
    __tablename__ = 'Questions'  # 匹配数据库中的表名

    QuestionID = db.Column(db.Integer, primary_key=True, autoincrement=True, name='QuestionID')
    QuestionContent = db.Column(db.Text, nullable=False, name='QuestionContent')
    QuestionType = db.Column(db.Enum('Single', 'True/False', 'Fill-in-the-blank'), nullable=False, name='QuestionType')

    AnswerOptionA = db.Column(db.Text, name='AnswerOptionA')
    AnswerOptionB = db.Column(db.Text, name='AnswerOptionB')
    AnswerOptionC = db.Column(db.Text, name='AnswerOptionC')
    AnswerOptionD = db.Column(db.Text, name='AnswerOptionD')

    CorrectAnswer = db.Column(db.Text, nullable=False, name='CorrectAnswer')
    PlantImages = db.Column(db.String(255), nullable=False, name='PlantImages')
    Term = db.Column(db.Integer, nullable=False, name='Term')

    # 将对象转换为字典，方便返回给前端
    def to_dict(self):
        return {
            'QuestionID': self.QuestionID,
            'QuestionContent': self.QuestionContent,
            'QuestionType': self.QuestionType,
            'AnswerOptionA': self.AnswerOptionA,
            'AnswerOptionB': self.AnswerOptionB,
            'AnswerOptionC': self.AnswerOptionC,
            'AnswerOptionD': self.AnswerOptionD,
            'CorrectAnswer': self.CorrectAnswer,
            'PlantImages': self.PlantImages,
            'Term': self.Term
        }
