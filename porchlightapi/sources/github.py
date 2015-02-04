# -*- coding: utf-8 -*-

from urlparse import urlparse, urlunparse
import dateutil.parser
import requests

def github_data(project_url, branch='master', commit=''):
    """
    Fetch data from Github that's relevent to Porchlight.
    This function is meant to be used by all sources that might need to
    access Github data.
    """
    project_url_parts = urlparse(project_url)

    # If this is a Github URL, use api.github.com. Otherwise use /api/v3/
    api_url = None
    if project_url_parts.netloc == 'github.com':
        api_url = project_url_parts._replace(
            netloc='api.' + project_url_parts.netloc)
    else:
        api_url = project_url_parts._replace(
            path='/api/v3')

    # Construct an API URL for the repository itself. This API call is only used
    # to get the repo size, which is about the only metric we can get from
    # the Github API to scale the file changes (below) relative to the
    # repository.
    repo_url_parts = api_url._replace(
            path=api_url.path + '/repos' + project_url_parts.path)
    repo_url = urlunparse(repo_url_parts)
    repo_response = requests.get(repo_url)
    repo_size = repo_response.json()['size']

    # If we didn't get a specific commit, look up the branch and use that.
    commit_url = None
    if commit == '':
        # Get the specified branch so we can lookup the latest commit SHA.
        # We'll construct an API URL based on the project URL.
        branch_url_parts = api_url._replace(
            path=api_url.path + '/repos' + project_url_parts.path + '/branches/' + branch)
        branch_url = urlunparse(branch_url_parts)
        branch_response = requests.get(branch_url)

        # Note: the branch API call above gets us *some* of the commit info, but not
        # all. We don't get files data, for example, which is important for the
        # value calculation below.
        commit = branch_response.json()['commit']['sha']
        commit_url = branch_response.json()['commit']['url']
    else:
        commit_url_parts = api_url._replace(
            path=api_url.path + '/repos' + project_url_parts.path + '/commits/' + commit)
        commit_url = urlunparse(commit_url_parts)

    commit_response = requests.get(commit_url)
    commit_json = commit_response.json()
    commit_num_files = len(commit_json['files'])

    # Pyhton date formatting doesn't give any good option for parsing ISO-8601
    # dates that include a 'Z' (Zulu) for UTC instead of simply +0000. According
    # to the Github API documentation, Github returns ISO-8601 with the full
    # timezone offset. However, the results I'm seeing from Github all represent
    # the timezone as 'Z'. To be safe, not make assumptions, and not add
    # unnecessary complexity, `dateutil.parser` is being used to parse date
    # strings.
    commit_date_string = commit_json['commit']['committer']['date']
    commit_date = dateutil.parser.parse(commit_date_string)

    # This is the useful information to us about how valuable this commit might
    # be. This is used below in the value calcualtion.
    commit_additions = 0
    commit_deletions = 0
    commit_changes = 0
    for file in commit_json['files']:
        commit_additions = commit_additions + file['additions']
        commit_deletions = commit_deletions + file['deletions']
        commit_changes = commit_changes + file['changes']

    return {'repo_size': repo_size,
            'commit': commit,
            'commit_num_files': commit_num_files,
            'commit_date': commit_date,
            'commit_additions': commit_additions,
            'commit_deletions': commit_deletions,
            'commit_changes': commit_changes,}


def github_source(project_url, branch='master'):
    """
    Github value source for Porchlight.

    Fetch the latest commit date, SHA, and lines from Github for the
    given project URL.

    Based on Github API documentation here: https://developer.github.com/v3/git/commits/
    """
    github_dict = github_data(project_url, branch=branch)

    # XXX: I am skeptical that this formula is useful. It includes nothing in
    # relation to the project size, we may want to value deletions as much as
    # additions, rather than presuming they have negative valuye, etc...
    value = github_dict['commit_additions'] - \
            github_dict['commit_deletions'] + \
            github_dict['commit_changes']

    return (github_dict['commit'], github_dict['commit_date'], value)


