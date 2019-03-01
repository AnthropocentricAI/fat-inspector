import datetime
import os
from threading import Timer
from typing import Dict


class ExpiryWatcher:
    """Enforces an expiry date on the stored trees.

    Checks at regular intervals whether any of the computed tree pickles have
    expired, and if so, deletes them. To add new files to be checked, change
    the `expiry_dates` dictionary.

    Attributes:
        expiry_dates: a dictionary in the form { <expiry_date>: <path> }
        interval: how often to check, in seconds.
    """

    _stopped: bool
    expiry_dates: Dict[str, datetime.date]
    interval: int

    def __init__(self, interval=900):
        self._stopped = False
        self.interval = interval
        self.expiry_dates = {}

    def _check(self):
        to_remove = []

        for k, v in self.expiry_dates.items():
            # if expired, remove
            if v < datetime.datetime.now():
                print('Removing {}...'.format(v))
                try:
                    os.remove(k)
                except OSError:
                    print('''Failed to remove {} - file may not exist.'''
                          .format(k))
                # flag to be removed
                to_remove.append(k)

        for f in to_remove:
            self.expiry_dates.pop(f, None)

    def _schedule(self):
        if not self._stopped:
            t = Timer(self.interval, self._schedule)
            t.start()
            self._check()

    def start(self):
        self._stopped = False
        self._schedule()

    def stop(self):
        self._stopped = True
