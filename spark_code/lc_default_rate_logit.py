from pyspark.mllib.regression import LabeledPoint
from pyspark.mllib.classification import LogisticRegressionWithLBFGS, LogisticRegressionModel

df = sqlContext.read.format('com.databricks.spark.csv').options(header='true', inferschema='true').load('/loans_data.csv')

def labelData(data):
    # label: row[start], features: row[1:end]
    return data.map(lambda row: LabeledPoint(row[0], row[1:]))

training_data, testing_data = labelData(df.rdd).randomSplit([0.8, 0.2])
logit_model = LogisticRegressionWithLBFGS.train(training_data, regParam=0.3)
labels_and_preds = testing_data.map(lambda p: (p.label, logit_model.predict(p.features)))
test_accuracy = labels_and_preds.filter(lambda (v, p): v == p).count() / float(testing_data.count())
