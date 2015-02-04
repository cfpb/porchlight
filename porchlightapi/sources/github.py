# -*- coding: utf-8 -*-

from urlparse import urlparse, urlunparse
import dateutil.parser
import requests

def github_source(project_url, branch='master'):
    """
    Github value source for Porchlight.

    Fetch the latest commit date, SHA, and lines from Github for the
    given project URL.

    Based on Github API documentation here: https://developer.github.com/v3/git/commits/
    """
    project_url_parts = urlparse(project_url)

    # Construct an API URL for the repository itself. This API call is only used
    # to get the repo size, which is about the only metric we can get from
    # the Github API to scale the file changes (below) relative to the
    # repository.
    repo_url_parts = project_url_parts._replace(
        netloc='api.' + project_url_parts.netloc,
        path='/repos' + project_url_parts.path)
    repo_url = urlunparse(repo_url_parts)
    repo_response = requests.get(repo_url)
    repo_size = repo_response.json()['size']

    # Get the specified branch so we can lookup the latest commit SHA.
    # We'll construct an API URL based on the project URL.
    branch_url_parts = project_url_parts._replace(
        netloc='api.' + project_url_parts.netloc,
        path='/repos' + project_url_parts.path + '/branches/' + branch)
    branch_url = urlunparse(branch_url_parts)
    branch_response = requests.get(branch_url)

    # Note: the branch API call above gets us *some* of the commit info, but not
    # all. We don't get files data, for example, which is important for the
    # value calculation below.
    last_commit_sha = branch_response.json()['commit']['sha']
    last_commit_url = branch_response.json()['commit']['url']
    last_commit_response = requests.get(last_commit_url)
    last_commit_json = last_commit_response.json()
    last_commit_num_files = len(last_commit_json['files'])

    # Pyhton date formatting doesn't give any good option for parsing ISO-8601
    # dates that include a 'Z' (Zulu) for UTC instead of simply +0000. According
    # to the Github API documentation, Github returns ISO-8601 with the full
    # timezone offset. However, the results I'm seeing from Github all represent
    # the timezone as 'Z'. To be safe, not make assumptions, and not add
    # unnecessary complexity, `dateutil.parser` is being used to parse date
    # strings.
    last_commit_date_string = last_commit_json['commit']['committer']['date']
    last_commit_date = dateutil.parser.parse(last_commit_date_string)

    # This is the useful information to us about how valuable this commit might
    # be. This is used below in the value calcualtion.
    last_commit_additions = 0
    last_commit_deletions = 0
    last_commit_changes = 0
    for file in last_commit_json['files']:
        last_commit_additions = last_commit_additions + file['additions']
        last_commit_deletions = last_commit_deletions + file['deletions']
        last_commit_changes = last_commit_changes + file['changes']

    # XXX: I am skeptical that this formula is useful. It includes nothing in
    # relation to the project size, we may want to value deletions as much as
    # additions, rather than presuming they have negative valuye, etc...
    value = last_commit_additions - last_commit_deletions + last_commit_changes

    return (last_commit_sha, last_commit_date, value)



