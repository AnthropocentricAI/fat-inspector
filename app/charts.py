import fatd.measure.accountability.models
import fatd.measure.fairness.models
import fatd.measure.accountability.data
import fatd.measure.fairness.data
import fatd.measure.accountability.predictions
import fatd.measure.fairness.predictions

import base64
from io import BytesIO

import inspect

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

from threading import Lock
lock = Lock()

mpl.use('Svg')
mpl.rcParams['svg.image_inline'] = False
plt.ioff()


# args :: {data_obj: ..., data_to_model_obj: ..., model_obj: ...}
def applyArgs(func, args, extraArgs={}):
    required = inspect.getargspec(func).args
    toApply = [args[x] for x in required if x in args]
    return func(*toApply, **extraArgs)


def encodeFig(fig):
    tmpfile = BytesIO()
    fig.savefig(tmpfile, format='svg')
    return base64.b64encode(tmpfile.getvalue()).decode()


def pieChart(data_obj):
    with lock:
        names, values = fatd.measure.accountability.data.class_count(data_obj)

        fig = plt.figure(1, figsize=(10, 5))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
        ax.pie(values, labels=names)

        svg = encodeFig(fig)
        plt.close(fig)
    return ('', svg)


def histogram(data_obj, col=0):
    with lock:
        bins, counts = fatd.measure.fairness.data.feature_histogram(
            data_obj, col)
        bin_width = bins[1]-bins[0]
        bins_centres = [bins[i]+(bins[i+1]-bins[i]/2)
                        for i in range(len(bins)-1)]

        fig = plt.figure(1, figsize=(10, 5))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])

        ax.bar(bins_centres, counts, bin_width)

        svg = encodeFig(fig)
        plt.close(fig)
    return ('', svg)


def train_accuracy(data_obj, data_to_model_obj, model_obj):
    acc = fatd.measure.fairness.models.training_accuracy(
        model_obj, data_to_model_obj, data_obj)
    return (acc, None)


def data_accuracy(data_obj, model_obj):
    acc = fatd.measure.fairness.models.data_accuracy(model_obj, data_obj)
    return (acc, None)


def prediction_accuracy(predictions_obj):
    acc = fatd.measure.fairness.predictions.prediction_accuracy(
        predictions_obj)
    return (acc, None)


def confusion_matrix(matrix):
    with lock:
        fig = plt.figure(1, figsize=(10, 5))
        ax = fig.add_axes([0.1, 0.1, 0.9, 0.9])

        # cmap=plt.get_cmap('summer'))
        handle = ax.imshow(matrix, interpolation='nearest', cmap=plt.cm.Blues)
        handle.set_cmap('gray')
        ax.figure.colorbar(handle, ax=ax)

        it = np.nditer(matrix, flags=['multi_index'])
        while not it.finished:
            ax.text(it.multi_index[1], it.multi_index[0], it[0], fontsize=12)
            it.iternext()
        svg = encodeFig(fig)
        plt.close(fig)
    return svg


def training_confusion_matrix(data_obj, data_to_model_obj, model_obj):
    matrix = fatd.measure.accountability.models.training_confusion_matrix(
        model_obj, data_to_model_obj, data_obj)
    return ('', confusion_matrix(matrix))


def data_confusion_matrix(data_obj, model_obj):
    matrix = fatd.measure.accountability.models.data_confusion_matrix(
        model_obj, data_obj)
    return ('', confusion_matrix(matrix))


def prediction_confusion_matrix(predictions_obj):
    matrix = fatd.measure.accountability.predictions.prediction_confusion_matrix(
        predictions_obj)
    return ('', confusion_matrix(matrix))
