"""Module for exposing valid functions for nodes."""

import fatd.transform.data

# use a dict lookup here so you can't just execute arbitrary code
funcs = {
    'fatd.transform.data.mean': fatd.transform.data.mean,
    'fatd.transform.data.median': fatd.transform.data.median,
    'fatd.transform.data.threshold': lambda x: fatd.transform.data.threshold(value=x, lower=0.5, upper=1.5)
}
