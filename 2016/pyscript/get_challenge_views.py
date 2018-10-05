#!/usr/bin/python
# -*- coding: utf-8 -*-
#
# Copyright 2014 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Reference command-line example for Google Analytics Core Reporting API v3.
This application demonstrates how to use the python client library to access
all the pieces of data returned by the Google Analytics Core Reporting API v3.
The application manages autorization by saving an OAuth2.0 token in a local
file and reusing the token for subsequent requests.
Before You Begin:
Update the client_secrets.json file
  You must update the clients_secrets.json file with a client id, client
  secret, and the redirect uri. You get these values by creating a new project
  in the Google APIs console and registering for OAuth2.0 for installed
  applications: https://code.google.com/apis/console
  Learn more about registering your analytics application here:
  http://developers.google.com/analytics/devguides/reporting/core/v3/gdataAuthorization
Supply your TABLE_ID
  You will also need to identify from which profile to access data by
  specifying the TABLE_ID constant below. This value is of the form: ga:xxxx
  where xxxx is the profile ID. You can get the profile ID by either querying
  the Management API or by looking it up in the account settings of the
  Google Anlaytics web interface.
Sample Usage:
  $ python core_reporting_v3_reference.py ga:xxxx
Where the table ID is used to identify from which Google Anlaytics profile
to retrieve data. This ID is in the format ga:xxxx where xxxx is the
profile ID.
Also you can also get help on all the command-line flags the program
understands by running:
  $ python core_reporting_v3_reference.py --help
"""
from __future__ import print_function

__author__ = 'killian.34@osu.edu (Jackson Killian)'

import argparse
import sys
import matplotlib as mpl
mpl.use('Agg')
import matplotlib.pyplot as plt

from googleapiclient.errors import HttpError
from googleapiclient import sample_tools
from oauth2client.client import AccessTokenRefreshError

# Declare command-line flags.
argparser = argparse.ArgumentParser(add_help=False)
argparser.add_argument('table_id', type=str,
                     help=('The table ID of the profile you wish to access. '
                           'Format is ga:xxx where xxx is your profile ID.'))

pages = ['/2016/challenges/aws/index.html','/2016/challenges/aws2/index.html','/2016/challenges/capitalone/index.html','/2016/challenges/esri/index.html','/2016/challenges/jobsohio/index.html','/2016/challenges/jpmc/index.html','/2016/challenges/wmc/index.html','/2016/challenges/paxata/index.html']

def main(argv):
  # Authenticate and construct service.
  service, flags = sample_tools.init(
      argv, 'analytics', 'v3', __doc__, __file__, parents=[argparser],
      scope='https://www.googleapis.com/auth/analytics.readonly')

  all_data = {}
  for i,page in enumerate(pages):
  # Try to make a request to the API. Print the results or handle errors.
    try:
      results = get_api_query(service, flags.table_id, page).execute()
      print("Views for ", page , ":")
      titletag = page[page.find("es")+3:page.rfind("/")]
      title = "../images/traffic/pageviews_"+titletag+".png"
      import os
      print (os.getcwd())
      print_results(results,title,all_data)

    except TypeError as error:
      # Handle errors in constructing a query.
      print(('There was an error in constructing your query : %s' % error))

    except HttpError as error:
      # Handle API errors.
      print(('Arg, there was an API error : %s : %s' %
             (error.resp.status, error._get_reason())))

    except AccessTokenRefreshError:
      # Handle Auth errors.
      print ('The credentials have been revoked or expired, please re-run '
             'the application to re-authorize')

  mins = 30
  x = [i for i in range(mins)]

  max_y = 20
  for title in all_data:
   this_max = max(all_data[title])
   if this_max > max_y:
     max_y = this_max

  for title in all_data:
    view_data = all_data[title]
    plt.plot(x,view_data,linewidth = 3.5, color = "#BB0000")
    mins-=1
    plt.axis([-1, mins-1,0,max_y])
    plt.axis('off')
    print("data plotted")
    plt.savefig(title)
    print("figure saved")
    plt.clf()


def get_api_query(service, table_id, page_path):
  """Returns a query object to retrieve data from the Core Reporting API.
  Args:
    service: The service object built by the Google API Python client library.
    table_id: str The table ID form which to retrieve data.
  """

  return service.data().realtime().get(
      ids=table_id,
      #start_date='2016-11-08',
      #end_date='2016-11-07',
      metrics='rt:pageviews',
      dimensions='rt:minutesAgo',
      sort='-rt:pageviews',
      filters='rt:pagePath=='+page_path,
      #start_index='1',
      max_results='25')


def print_results(results,title,d):
  """Prints all the results in the Core Reporting API Response.
  Args:
    results: The response returned from the Core Reporting API.
  """

  mins = 30

  views = get_pageviews(results)
  
  print(views)

  #print_report_info(results)
  #print_pagination_info(results)
  #print_profile_info(results)
  #print_query(results)
  #print_column_headers(results)

  views_per_minute = print_rows(results)

  for item in views_per_minute:
    item[0] = int(item[0])

  views_per_minute = sorted(views_per_minute, key=lambda x: x[0])

  minutes = set([int(x[0]) for x in views_per_minute])

  view_data = []

  #use this index to iterate through the views_per_minute array
  j = 0
  print (views_per_minute)
  for i in range(mins):
    if i in minutes:
      print ("Found minute",i,)
      view_data.append(int(views_per_minute[j][1]))
      j+=1
    else:
      view_data.append(0)

  print (view_data)
  print (len(view_data))


  d[title] = view_data


def get_pageviews(results):
  """Prints the total metric value for all pages the query matched.
  Args:
    results: The response returned from the Core Reporting API.
  """

  #print('Total Metrics For All Results:')
  #print('This query returned %s rows.' % len(results.get('rows')))
  #print(('But the query matched %s total results.' %
    #     results.get('totalResults')))
  ##print('Here are the metric totals for the matched total results.')
  totals = results.get('totalsForAllResults')

  #print(totals)

  pageviews = 0
  for metric_name, metric_total in totals.iteritems():
    print('Metric Name  = %s' % metric_name)
    print('Metric Total = %s' % metric_total)
    print()
    pageviews = int(metric_total)
  
  return totals['rt:pageviews']















def print_report_info(results):
  """Prints general information about this report.
  Args:
    results: The response returned from the Core Reporting API.
  """

  print('Report Infos:')
  print('Contains Sampled Data = %s' % results.get('containsSampledData'))
  print('Kind                  = %s' % results.get('kind'))
  print('ID                    = %s' % results.get('id'))
  print('Self Link             = %s' % results.get('selfLink'))
  print()


def print_pagination_info(results):
  """Prints common pagination details.
  Args:
    results: The response returned from the Core Reporting API.
  """

  print('Pagination Infos:')
  print('Items per page = %s' % results.get('itemsPerPage'))
  print('Total Results  = %s' % results.get('totalResults'))

  # These only have values if other result pages exist.
  if results.get('previousLink'):
    print('Previous Link  = %s' % results.get('previousLink'))
  if results.get('nextLink'):
    print('Next Link      = %s' % results.get('nextLink'))
  print()


def print_profile_info(results):
  """Prints information about the profile.
  Args:
    results: The response returned from the Core Reporting API.
  """

  print('Profile Infos:')
  info = results.get('profileInfo')
  print('Account Id      = %s' % info.get('accountId'))
  print('Web Property Id = %s' % info.get('webPropertyId'))
  print('Profile Id      = %s' % info.get('profileId'))
  print('Table Id        = %s' % info.get('tableId'))
  print('Profile Name    = %s' % info.get('profileName'))
  print()
  


def print_query(results):
  """The query returns the original report query as a dict.
  Args:
    results: The response returned from the Core Reporting API.
  """

  print('Query Parameters:')
  query = results.get('query')
  for key, value in query.iteritems():
    print('%s = %s' % (key, value))
  print()


def print_column_headers(results):
  """Prints the information for each column.
  The main data from the API is returned as rows of data. The column
  headers describe the names and types of each column in rows.
  Args:
    results: The response returned from the Core Reporting API.
  """

  print('Column Headers:')
  headers = results.get('columnHeaders')
  for header in headers:
    # Print Dimension or Metric name.
    print('\t%s name:    = %s' % (header.get('columnType').title(),
                                  header.get('name')))
    print('\tColumn Type = %s' % header.get('columnType'))
    print('\tData Type   = %s' % header.get('dataType'))
    print()




def print_rows(results):
  """Prints all the rows of data returned by the API.
  Args:
    results: The response returne d from the Core Reporting API.
  """
  rows = []
  print('Rows:')
  if results.get('rows', []):
    rows = results.get('rows')
    for row in rows:
      print('\t'.join(row))
  else:
    print('No Rows Found')

  return rows


if __name__ == '__main__':
  main(sys.argv)
