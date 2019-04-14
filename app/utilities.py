import os


def normalise_path_to_file(path: str) -> str:
    """Wrapper for os.path.basename and os.path.normpath."""
    return os.path.basename(os.path.normpath(path))


def touch_file(path: str):
    """Creates a new empty file at path."""
    with open(path, 'w'):
        pass


def list_files_in_dir(directory: str, ext='', strip_endings=True) -> [str]:
    """
        Lists all the files in a directory. If strip_endings is set, then the extension is removed from each file in
        the list.
    :param directory: Path to directory to search.
    :param ext: File extension to filter by.
    :param strip_endings: Removes file extensions if True.
    :return:
    """
    _, _, files = next(os.walk(directory))
    if strip_endings:
        ext_len = len(ext)
        return [f[:-ext_len] for f in files if f.endswith(ext)]
    else:
        return [f for f in files if f.endswith(ext)]
