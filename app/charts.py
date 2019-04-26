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


def pieChart(dataset):
    with lock:
        names, values = fatd.measure.accountability.data.class_count(dataset)
        
        fig = plt.figure(1, figsize=(6,6))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
        ax.pie(values, labels=names)

        tmpfile = BytesIO()
        
        fig.savefig(tmpfile, format='svg')
        plt.close(fig)
    return ('', base64.b64encode(tmpfile.getvalue()).decode())

def histogram(dataset, col=0):
    with lock:
        bins, counts = fatd.measure.fairness.data.feature_histogram(dataset, col)
        bin_width = bins[1]-bins[0]
        bins_centres = [bins[i]+(bins[i+1]-bins[i]/2) for i in range(len(bins)-1)]

        fig = plt.figure(1, figsize=(6,6))
        ax = fig.add_axes([0.1, 0.1, 0.8, 0.8])
        
        ax.bar(bins_centres, counts, bin_width)

        tmpfile = BytesIO()
        fig.savefig(tmpfile, format='svg')
        plt.close(fig)
    return ('', base64.b64encode(tmpfile.getvalue()).decode())