import os


def normalise_path_to_file(path: str) -> str:
    """
        Wrapper for os.path.basename and os.path.normpath
    """
    return os.path.basename(os.path.normpath(path))


def touch_file(path: str):
    with open(path, 'w'):
        pass
