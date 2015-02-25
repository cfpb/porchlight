# -*- coding: utf-8 -*-

from urlparse import urlparse, urlunparse

import json
import dateutil.parser

from porchlightapi import settings
from .github import github_commit_data

def json_file_source(repository):
    """
    A JSON file on the server includes the repo url and a commit SHA.
    Given a URL, look it up in that file, and then fetch the information

    we need about the commit from Github.

    Fetch the latest commit date, SHA, and lines from Github for the
    given project URL.

    Based on Github API documentation here: https://developer.github.com/v3/git/commits/
    """

    # Open the file
    repos = json.load(open(settings.PORCHLIGHT_JSON_FILE))

    # Lookup the repository URL
    repo_dict = next((item for item in repos if item[u'repo'].lower().startswith(repository.url)), None)

    # Get the commit SHA
    commit = repo_dict['commit']
    date_string = repo_dict['date']
    date_string = repo_dict['date']
    date = dateutil.parser.parse(date_string)

    # Lookup the data in Github
    github_dict = github_commit_data(repository.url, commit=commit)

    # XXX: I am skeptical that this formula is useful. It includes nothing in
    # relation to the project size, we may want to value deletions as much as
    # additions, rather than presuming they have negative valuye, etc...
    value = github_dict['commit_additions'] - \
            github_dict['commit_deletions'] + \
            github_dict['commit_changes']

    return (commit, date, value)

