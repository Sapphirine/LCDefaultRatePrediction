from flask import Flask, request
from flask import render_template
from models import *

app = Flask(__name__)

@app.route('/')
def index():
	loans_count = Loan.select().count()
	gradelist = Loan.select(Loan.grade).distinct().order_by(Loan.grade.asc())
	return render_template('index.html', count=loans_count, gradelist = gradelist)

@app.route('/grades', methods=['POST'])
def grades():
	grade = request.form.get("grade")
	term = " "+request.form.get("term")
	loans = Loan.select().where(Loan.grade == grade, Loan.term == term).limit(20)
	return render_template('table.html', loans = loans, grade = grade, term = term)

if __name__ == '__main__':
    app.run(debug=True)