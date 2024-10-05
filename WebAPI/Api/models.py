from . import db
from werkzeug.security import generate_password_hash, check_password_hash 
from datetime import datetime


class User(db.Model):
    __tablename__ = 'Users' 

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


class User_Answers(db.Model):
    __tablename__ = 'User_Answers'
    AnswerID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=True)
    QuestionID = db.Column(db.Integer, db.ForeignKey('Questions.QuestionID'), nullable=True)
    SubmitTime = db.Column(db.DateTime, default=datetime.utcnow)
    TotalSingleScore = db.Column(db.Integer, default=0)
    TotalTrueFalseScore = db.Column(db.Integer, default=0)
    TotalFillBlankScore = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "AnswerID": self.AnswerID,
            "UserID": self.UserID,
            "QuestionID": self.QuestionID,
            "SubmitTime": self.SubmitTime.strftime('%d/%m/%y %H:%M') if self.SubmitTime else None,
            "TotalSingleScore": self.TotalSingleScore,
            "TotalTrueFalseScore": self.TotalTrueFalseScore,
            "TotalFillBlankScore": self.TotalFillBlankScore,
        }



class Score(db.Model):
    __tablename__ = 'Scores'  
    ScoreID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    TotalScore = db.Column(db.Integer, nullable=False)
    Rank = db.Column(db.Integer, nullable=True)
    def to_dict(self):
        return {
            "ScoreID": self.ScoreID,
            "UserID": self.UserID,
            "TotalScore": self.TotalScore,
            "Rank": self.Rank,
        }
    

class Question(db.Model):
    __tablename__ = 'Questions' 

    QuestionID = db.Column(db.Integer, primary_key=True, autoincrement=True, name='QuestionID')
    QuestionContent = db.Column(db.Text, nullable=False, name='QuestionContent')
    CorrectAnswer = db.Column(db.Text, nullable=False, name='CorrectAnswer')
    PlantImages = db.Column(db.String(255), nullable=False, name='PlantImages')
    Term = db.Column(db.Integer, nullable=False, name='Term')

  
    def to_dict(self):
        return {
            'QuestionID': self.QuestionID,
            'QuestionContent': self.QuestionContent,
            'CorrectAnswer': self.CorrectAnswer,
            'PlantImages': self.PlantImages,
            'Term': self.Term
        }
