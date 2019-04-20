from wsgiref.simple_server import make_server # the wsgiref webserver (default with Python)
from pyramid.config import Configurator

from pyramid.response import Response
from pyramid.response import FileResponse
from pyramid.renderers import render_to_response

''' Routes '''
def basic_route(req):
  data = {}
  return render_to_response('landingpage.html', data, request=req)

def analytics_route(req):
  return FileResponse('analytics.html')

''' Main Application '''
def main() :
  with Configurator() as config:

    # basic_route
    config.add_route('landing', '/')
    config.add_view(basic_route, route_name='landing')

    # view_route
    config.add_route('analytics', '/analytics')
    config.add_view(analytics_route, route_name='analytics')

    # for template_route / template_route2
    config.include('pyramid_jinja2')
    config.add_jinja2_renderer('.html')


    # add static folder to search path
    config.add_static_view(name='/', path='./public', cache_max_age=3600)

    # create the webserver config
    app = config.make_wsgi_app()

  # run the server
  server = make_server('127.0.0.1', 8080, app)
  print("The server is now running on: http://127.0.0.1:8080")
  
  try:
    server.serve_forever()
  except KeyboardInterrupt:
    print("\nExiting...")
    exit(0)

if __name__ == '__main__':
  main()
