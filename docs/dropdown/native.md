extends ../example.pug

block example_title
  span Native

block example_result
  +dropdown_native()

block example_code
  include ../sources/dropdown/native.html

block sidebar
  +sidebar('components', 'dropdown', 'native')
