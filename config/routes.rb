Gumby::Application.routes.draw do
  get "pages/grid"
  get "pages/ui"
  root :to => 'pages#grid'
end
