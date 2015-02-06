from fabric.api import *
from fabric.contrib.files import exists
from fabric.colors import red, cyan, green

SEARCH_LOCATIONS = ['/var/www/html/wordpress/wp-content/plugins',
					'/var/www/html/wordpress/wp-content/themes',
					'/var/www/django/CFGOV/src',
					'/var/www/django',
					'/var/www/',
					'/var/www/staticsites',
					'/var/www/site',
					]

@task
def get_all_commit_info():
	repo_info = []
	puts(cyan("Starting to gather information about the current server..."))
	for folder in SEARCH_LOCATIONS:
		puts(cyan("Searching %s" % folder))
		with(cd(folder)):
			repo_info.extend(get_commit_info_in_directory())
				
	print repo_info


def get_commit_info_in_directory():
	repo_info = []
	with settings(hide('warnings', 'stderr', 'stdout', 'running'), 
                warn_only=True):
		folder_list = sudo('ls').split()
		for folder in folder_list:
			if exists("%s/.git/" % folder, use_sudo=True):
				puts("Getting info on %s" % folder)
				with(cd(folder)):
					repo_info.append({'name': folder,
							'commit': sudo('git rev-parse HEAD'), 
							'repo': sudo('''git remote -v | head -n 1 | awk -F ' ' '{print $2}' '''),
							'date': sudo('date -r ../%s' % folder)})
	return repo_info

