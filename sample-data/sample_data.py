
from urlparse import urlparse, urlunparse
import requests
import dateutil.parser
import pickle
import os.path
import datetime
import json
from dateutil import tz

import link_header

AUTH=('', '')

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj

def github_api_all(url):
    """
    Fetch all results, not simply the first page of results, for the given URL.
    """

    # Get our initial response
    response = requests.get(url, auth=AUTH)
    response_json = response.json()

    # Parse the links header
    parsed_links = link_header.parse_link_value(response.headers['link'])
    links = dict([(parsed_links[l]['rel'], l) for l in parsed_links])
    while 'next' in links:
        # While we have a 'next' link, fetch it and add its response to the json
        # object.
        page_response = requests.get(links['next'], auth=AUTH)
        response_json += page_response.json()

        parsed_links = link_header.parse_link_value(page_response.headers['link'])
        links = dict([(parsed_links[l]['rel'], l) for l in parsed_links])

    return response_json

def github_data(repo_url, branch='master', commit=''):
    """
    Fetch data from Github that's relevent to Porchlight.
    This function is meant to be used by all sources that might need to
    access Github data.
    """
    repo_url_parts = urlparse(repo_url)

    # If this is a Github URL, use api.github.com. Otherwise use /api/v3/
    api_url = None
    if repo_url_parts.netloc == 'github.com':
        api_url = repo_url_parts._replace(
            netloc='api.' + repo_url_parts.netloc,
            path='')
    else:
        api_url = repo_url_parts._replace(
            path='/api/v3')

    # Construct an API URL for the repository itself. This API call is only used
    # to get the repo size, which is about the only metric we can get from
    # the Github API to scale the file changes (below) relative to the
    # repository.
    repo_url_parts = api_url._replace(
            path=api_url.path + '/repos' + repo_url_parts.path)
    repo_url = urlunparse(repo_url_parts)
    repo_response = requests.get(repo_url, auth=AUTH)
    repo_size = repo_response.json()['size']

    # If we didn't get a specific commit, look up the branch and use that.
    commit_url = None
    if commit == '':
        # Get the specified branch so we can lookup the latest commit SHA.
        # We'll construct an API URL based on the project URL.
        branch_url_parts = api_url._replace(
            path=api_url.path + '/repos' + repo_url_parts.path + '/branches/' + branch)
        branch_url = urlunparse(branch_url_parts)
        branch_response = requests.get(branch_url, auth=AUTH)

        # Note: the branch API call above gets us *some* of the commit info, but not
        # all. We don't get files data, for example, which is important for the
        # value calculation below.
        commit = branch_response.json()['commit']['sha']
        commit_url = branch_response.json()['commit']['url']
    else:
        commit_url_parts = api_url._replace(
            path=api_url.path + repo_url_parts.path + '/commits/' + commit)
        commit_url = urlunparse(commit_url_parts)

    commit_response = requests.get(commit_url, auth=AUTH)
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



def sample_repo(sample_data, pk, repo_url, name, project=""):
    print "Sampling " + repo_url

    # Append this repository to our sample data.
    sample_data.append({
        "fields": {
            "name": name,
            "url": repo_url,
            "project": project,
            "undeployed_value_source": "porchlightapi.sources.github_source",
            "value_calculator": "porchlightapi.sources.incremental_value_calculator",
            "deployed_value_source": "porchlightapi.sources.json_file_source"
        },
        "model": "porchlightapi.repository",
        "pk": pk
    })


    # (1) Get data for the commit
    repo_url_parts = urlparse(repo_url)

    api_url = None
    if repo_url_parts.netloc == 'github.com':
        api_url = repo_url_parts._replace(
            netloc='api.' + repo_url_parts.netloc,
            path='')
    else:
        api_url = repo_url_parts._replace(
            path='/api/v3')

    # Use a file to store the data so we don't hit rate limits
    commit_data = []
    if os.path.isfile(str(pk) + '_commit_data.pickle'):
        print repo_url + " Commit Data is already pickled"
        commit_data = pickle.load(open(str(pk) + '_commit_data.pickle'))
    else:
        repo_url_parts = urlparse(repo_url)

        api_url = None
        if repo_url_parts.netloc == 'github.com':
            api_url = repo_url_parts._replace(
                netloc='api.' + repo_url_parts.netloc,
                path='')
        else:
            api_url = repo_url_parts._replace(
                path='/api/v3')

        # For each commit in the repository:
        commits_url_parts = api_url._replace(
            path=api_url.path + '/repos' + repo_url_parts.path + '/commits')
        commits_url = urlunparse(commits_url_parts)

        # commits_response = requests.get(commits_url, auth=AUTH)
        # commits_response_json = commits_response.json()

        #  Get paginated commits
        commits_response_json = github_api_all(commits_url)

        commits_list = [c['sha'] for c in commits_response_json]
        commit_data = [github_data(repo_url, commit=c) for c in commits_list]

        commit_data.sort(key=lambda item:item['commit_date'], reverse=False)
        pickle.dump(commit_data, open(str(pk) + '_commit_data.pickle', 'wb'))

    # (2) Get all tags on the repository.
    tag_data = []
    if os.path.isfile(str(pk) + '_tag_data.pickle'):
        print repo_url + " Tag Data is already pickled"
        tag_data = pickle.load(open(str(pk) + '_tag_data.pickle'))
    else:
        # For each commit in the repository:
        tags_url_parts = api_url._replace(
            path=api_url.path + '/repos' + repo_url_parts.path + '/tags')
        tags_url = urlunparse(tags_url_parts)
        tags_response = requests.get(tags_url, auth=AUTH)
        tags_response_json = tags_response.json()
        tag_data = dict([(t['commit']['sha'], t['name']) for t in tags_response_json if t['name'].startswith('v')])

        pickle.dump(tag_data, open(str(pk) + '_tag_data.pickle', 'wb'))

    # Sort the commits by date descending.

    # (3) See what the date delta is between tag commits and commits themselves.
    value = 0
    d = datetime.datetime.fromtimestamp(0)
    d = d.replace(tzinfo=tz.tzutc())
    c = datetime.datetime.now()
    c = c.replace(tzinfo=tz.tzutc())
    last_deployed_commit = {'commit': '', 'commit_date': d}
    for commit in commit_data:
        # See if the commit is tagged
        if commit['commit'] in tag_data:
            # If so, the value goes to 0.
            last_deployed_commit = commit
            value = 0
        else:
            # Otherwise, increment it
            value += abs(commit['commit_additions'] - \
                         commit['commit_deletions'] + \
                         commit['commit_changes'])

        # c_pk = commit_data.index(commit)

        # github_dict['commit'], github_dict['commit_date'], value

        sample_data.append({
                "fields": {
                    "repository": pk,
                    "deployed_identifier": last_deployed_commit['commit'],
                    "undeployed_value": value,
                    "deployed_value": 0,
                    "created": commit['commit_date'].isoformat(),
                    "undeployed_identifier": commit['commit'],
                    "value": value,
                    "undeployed_datetime": commit['commit_date'].isoformat(),
                    # "deployed_datetime": last_deployed_commit['commit_date'].isoformat(),
                },
                "model": "porchlightapi.valuedatapoint",
            })




if __name__ == "__main__":
    sample_data = []
    sample_repo(sample_data, 1, 'https://github.com/cfpb/owning-a-home-api', 'OAH-API', 'Owning a Home')
    sample_repo(sample_data, 2, 'https://github.com/cfpb/owning-a-home', 'Owning a Home', 'Owning a Home')
    sample_repo(sample_data, 3, 'https://github.com/cfpb/cms-toolkit', 'WordPress CMS Toolkit', 'CF.gov')
    sample_repo(sample_data, 4, 'https://github.com/cfpb/wp-json-api', 'WordPress JSON API', 'CF.gov')
    sample_repo(sample_data, 5, 'https://github.com/cfpb/regulations-core', 'regulations-core', 'eRegulations')
    # sample_repo(sample_data, 6, 'https://github.com/cfpb/mapusaurus', 'Mapusaurus', 'Fair Lending')

    json.dump(sample_data, open('data.json', 'w'), indent=4)

