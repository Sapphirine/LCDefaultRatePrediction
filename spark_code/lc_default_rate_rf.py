from pyspark.mllib.regression import LabeledPoint
from pyspark.mllib.tree import RandomForest
from pyspark.mllib.evaluation import MulticlassMetrics
from pyspark.mllib.classification import LogisticRegressionWithLBFGS, LogisticRegressionModel

df = sqlContext.read.format('com.databricks.spark.csv').options(header='true', inferschema='true').load('/loans_data.csv')
def labelData(data):
    # label: row[start], features: row[1:end]
    return data.map(lambda row: LabeledPoint(row[0], row[1:]))

def getPredictionsLabels(model, test_data):
    predictions = model.predict(test_data.map(lambda r: r.features))
    return predictions.zip(test_data.map(lambda r: r.label))

def printMetrics(predictions_and_labels):
    metrics = MulticlassMetrics(predictions_and_labels)
    print 'Precision of True ', metrics.precision(1)
    print 'Precision of False', metrics.precision(0)
    print 'Recall of True    ', metrics.recall(1)
    print 'Recall of False   ', metrics.recall(0)
    print 'F-1 Score         ', metrics.fMeasure()
    print 'Confusion Matrix\n', metrics.confusionMatrix().toArray()

training_data, testing_data = labelData(df.rdd).randomSplit([0.8, 0.2])
rf_model = RandomForest.trainClassifier(training_data, 2, {}, 50, seed=42)

predictions_and_labels = getPredictionsLabels(rf_model, testing_data)
printMetrics(predictions_and_labels)