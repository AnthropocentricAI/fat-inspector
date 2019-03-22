import base64
from io import BytesIO

import matplotlib.pyplot as plt
import numpy as np

import fatd.measure.accountability.data


# returns svg
def pieChart(dataset):
    names, values = fatd.measure.accountability.data.class_count(dataset)
    plt.pie(values, labels=names)

    tmpfile = BytesIO()
    plt.savefig(tmpfile, format='svg')
    return base64.b64encode(tmpfile.getvalue())