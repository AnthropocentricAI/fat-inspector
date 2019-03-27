import base64
from io import BytesIO

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np

mpl.rcParams['svg.image_inline'] = False

import fatd.measure.accountability.data
import fatd.measure.fairness.data


def pieChart(dataset):
    names, values = fatd.measure.accountability.data.class_count(dataset)
    plt.pie(values, labels=names)

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format='svg')
    return base64.b64encode(tmpfile.getvalue()).decode()

def histogram(dataset, col=0):
    bins, counts = fatd.measure.fairness.data.feature_histogram(dataset, col)
    bin_width = bins[1]-bins[0]
    bins_centres = [bins[i]+(bins[i+1]-bins[i]/2) for i in range(len(bins)-1)]
    plt.bar(bins_centres, counts, bin_width)

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format='svg')
    return base64.b64encode(tmpfile.getvalue()).decode()