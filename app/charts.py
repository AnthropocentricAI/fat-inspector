import base64
from io import BytesIO

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

from threading import Lock
lock = Lock()

mpl.use('Svg')
mpl.rcParams['svg.image_inline'] = False
plt.ioff()

import fatd.measure.accountability.data
import fatd.measure.fairness.data


def encodeFig(fig):
    tmpfile = BytesIO()
    fig.savefig(tmpfile, format='svg')
    return base64.b64encode(tmpfile.getvalue()).decode()


def pieChart(dataset):
    with lock:
        names, values = fatd.measure.accountability.data.class_count(dataset)
        
        fig = plt.figure(1, figsize=(6,6))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
        ax.pie(values, labels=names)

        svg = encodeFig(fig)
        plt.close(fig)
    return ('', svg)


def histogram(dataset, col=0):
    with lock:
        bins, counts = fatd.measure.fairness.data.feature_histogram(dataset, col)
        bin_width = bins[1]-bins[0]
        bins_centres = [bins[i]+(bins[i+1]-bins[i]/2) for i in range(len(bins)-1)]

        fig = plt.figure(1, figsize=(6,6))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
        
        ax.bar(bins_centres, counts, bin_width)

        svg = encodeFig(fig)
        plt.close(fig)
    return ('', svg)


def train_accuracy(model_obj, data_to_model_obj, data_obj):
    acc = fatd.measure.fairness.models.train_accuracy(model_obj, data_to_model_obj, data_obj)
    return (acc, None)


def data_accuracy(model_obj, data_obj):
    acc = fatd.measure.fairness.models.data_accuracy(model_obj, data_obj)
    return (acc, None)


def prediction_accuracy(prediction_obj):
    acc = fatd.measure.fairness.predictions.prediction_accuracy(prediction_obj)
    return (acc, None)


def confusion_matrix(matrix):
    with lock:
        handle = plt.imshow(matrix, cmap=plt.get_cmap('summer'))
        plt.colorbar(handle)
        svg = None
    return svg


def training_confusion_matrix(model_obj, data_to_model_obj, data_obj):
    matrix = fatd.measure.accountability.models.training_confusion_matrix(model_obj, data_to_model_obj, data_obj)
    return (confusion_matrix(matrix), None)


def data_confusion_matrix(model_obj, data_obj):
    matrix = fatd.measure.accountability.models.data_confusion_matrix(model_obj, data_obj)
    return (confusion_matrix(matrix), None)


def prediction_confusion_matrix(predictions_obj):
    matrix = fatd.measure.accountability.models.prediction_confusion_matrix(predictions_obj)
    return (confusion_matrix(matrix), None)