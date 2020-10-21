# Porchlight

:warning: This project is archived and no longer maintained :warning:

---
---
---

Application to display git repo deploy cycle

![Screenshot](screenshot.png)

Porchlight consists of a Django project, [`porchlight`](porchlight), a
Django app that publishes a RESTful API,
[`porchlightapi`](porchlightapi), and a front end which consumes that
API.

## Dependencies

The [`requirements.txt`](requirements.txt) file lists the requirements
for the Porchlight API and Django project. These are:

 * [Django 1.7](https://docs.djangoproject.com/en/1.7/)
 * [Django Rest Framework](http://www.django-rest-framework.org)
 * [pytz](http://pytz.sourceforge.net)
 * [Python Markdown](https://pythonhosted.org/Markdown/) (Used for
   formatting Django Rest Framework API documentation)
 * [mock](http://www.voidspace.org.uk/python/mock/) (Used for testing)


## Installation

To run the Porchlight API and Django project in your favorite
environment, [`virtualenv`](https://virtualenv.pypa.io/en/latest/),
which creates isolated Python environments, is recommended. 

### Quickstart

Create a `virtualenv` for Porchlight and "activate" it:

```shell
$ virtualenv porchlight_venv
$ source porchlight_venv/bin/activate
```

Clone the Porchlight source code from Github:

```shell
$ git clone https://github.com/cfpb/porchlight
```

Install Porchlight's Python dependencies:

```shell
$ cd porchlight 
$ pip install -r requirements.txt
```

Initialize the Porchlight database. 

(Note: SQLite is currently configured in Porchlight's [`settings.py`](porchlight/settings.py); this will probably be moved to a `local_settings.py` file in the future which will needed to be editted. For now, if you want to use a different database, you'll need to edit [`settings.py`](porchlight/settings.py).)

```shell
$ python manage.py migrate
$ python manage.py runserver

```

Once that is done, you should be able to visit
[http://localhost:8000/admin](http://localhost:8000/admin), login, and
begin creating Repository objects for which data can be collected.

To browse the REST API, you can visit 
[http://localhost:8000/porchlight](http://localhost:8000/porchlight). 

## Configuration

The Porchlight API Django app has three configuration options that
define possible Python callables that can provide source data and value
calculations for Porchlight.

#### <a name="value-sources-config"></a> Value Sources

```python 
PORCHLIGHT_UNDEPLOYED_SOURCES = (
    ('porchlightapi.sources.random_undeployed_source', 'Random Undeployed Source'),
)
PORCHLIGHT_DEPLOYED_SOURCES = (
    ('porchlightapi.sources.random_undeployed_source', 'Random deployed Source'),
)
```

Source callables for undeployed and deployed values. This is the list of
possible data sources that is exposed to users who are adding
repositories to Porchlight for data collection.

Value sources are [described in more detail below](#value-sources).

#### <a name="value-calculators-config"></a> Value Calculators

```python 
PORCHLIGHT_VALUE_CALCULATOR = (
    ('porchlightapi.sources.difference_value_calculator', 'Difference Between Undeployed and Deployed Value'),
    ('porchlightapi.sources.undeployed_value_only_calculator', 'Undeployed Value Only'),
)
```

Value calculator callables for undeployed and deployed values. This is 
the list of possible value calculators that is exposed to users who are 
adding repositories to Porchlight.

Value calculators are [described in more detail below](#value-calculators).

## Usage

### Porchlight API

The Porchlight API exposes two endpoints:

#### `/repositories`

Returns a list of all available repositories in Porchlight.

The `name`, `project`, and `url` fields can all be searched using
`?search=`. For example, `?search=porc` will match Porchlight.

Ordering can be changed based on `name`, `project`, and `url` using
`?ordering=`. For example, `?ordering=name` will order by name,
alphabetically. The ordering can be reversed using `?ordering=-name`.

#### `/datapoints`

Returns a list of available value data points in Porchlight.

The data points can be searched based on their associated
repository's `name`, `project`, or `url` using `?search=`. For
example, `?search=porc` would return a list of all data points
associated with the Porchlight repository.

Data points are always ordered descending by the date the data point
was created.

Data points are also paginated, defaulting to 10 results (at the
moment). This can be modified using `?limit=`, for example
`?limit=5` will limit to five results. Pages subsequent to first
page can be selected using `?page=`, for example `?page=2` will get
the second page of results.

### Acquiring and Calculating Value

In order to collect data about repositories, Porchlight offers the
ability to plug in Python callables (classes implementing `__call__` or
functions) that acquire value data, and calculators that take 
undeployed value data, deployed value data, and calculates the diffrence
between them. 

#### `getvalues` Management Command

The Porchlight API includes a management command to pull data from the
configured sources for specified repositories or all repositories. This
command is suitable for `cron` or similar periodic task systems.

For all repositories:

```shell
$ python manage.py getvalues
...
Got datapoint for https://github.com/cfpb/porchlight: 398
...
```

For a specific repository:

```shell
$ python manage.py getvalues
Got datapoint for https://github.com/cfpb/porchlight: 398
```

#### <a name="value-sources"></a> Value Sources

A value source is a Python callable that takes a project url (the
primary means by which Porchlight repositories are identified) and
returns a three-tuple that includes:

```python 
(value identifier, value datetime, value)
```

The value identifier is a string that would corrospond to, for example, 
a Git SHA for a specific commit, the datetime would corrospond to the 
date associated with that identifier (the date the value was created, 
*not* the date the value was read by Porchlight), and the value is an 
integer value.

Example value source:

```python 
def value_source(project_url):
    """
    Acquire a value for the given project_url
    """
    ...
    return (value_identifier, value_datetime, value)
```

Value source configuration is [described in more detail
above](#value-source-config).

#### <a name="value-calculators"></a> Value Calculators

A value calculator is a Python callable that takes an undeployed value three-tuple, a deployed value three-tuple, and calculates and returns a value difference between them. This value can be thought of as "unshipped value".

Example value calculator:

```python 
def value_source(undeployed_value_tuple, deployed_value_tuple):
    """
    Calculate a value from the given undeployed and deployed value
    tuples.
    """
    ...
    return value
```

Value calculator configuration is [described in more detail
above](#value-calculators-config).


## How to test the software

If the software includes automated tests, detail how to run those tests.

## Known issues

Document any known significant shortcomings with the software.

## Getting help

Instruct users how to get help with this software; this might include links to an issue tracker, wiki, mailing list, etc.

**Example**

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

## Getting involved

This section should detail why people should get involved and describe key areas you are
currently focusing on; e.g., trying to get feedback on features, fixing certain bugs, building
important pieces, etc.

General instructions on _how_ to contribute should be stated with a link to [CONTRIBUTING](CONTRIBUTING.md).


----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

1. Projects that inspired you
2. Related projects
3. Books, papers, talks, or other sources that have meaniginful impact or influence on this project 
