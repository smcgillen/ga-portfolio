$(document).ready(function () {
  // Dictionary of templates (these could otherwise be hidden in <script> tags)
  var templates = {
    appView: '<ul id="posts"></ul>',
    blogList: '<a href="#/posts/{{ slug }}">{{title}}</a>',
    blogView: '<div class="post"><h1 class="title">{{ title }}</h1><h3 class="slug">{{ slug }}</h3><div class="content">{{{ content }}}</div></div>'
  };

  // Our only model.
  var Post = Backbone.Model.extend({
    // Use slug instead of id to refer to these objects.
    idAttribute: 'slug',

    defaults: {
      title: 'New post',
      slug: 'new-post',
      content: 'content'
    }
  });

  // Not much to talk about here.
  var Posts = Backbone.Collection.extend({
    model: Post
  });

  var PostListView = Backbone.View.extend({
    tagName: 'li',

    events: {
      'click': 'view'
    },

    initialize: function () {
    },

    // Stick this new list item in the page.
    render: function () {
      console.log(this.model.toJSON());
      var template = Handlebars.compile( templates.blogList );
      this.$el.html( template(this.model.toJSON()) );

      // Returning this lets us chain our code.
      return this;
    },

    view: function () {
      // TARUN HOMEWORK: Try it without the true.
      app.navigate('posts/' + this.model.get('slug'), true);
      return false;
    }
  });

  // View for a single post.
  var PostView = Backbone.View.extend({
    el: '#main', // Where this is going to end up on the page.
    initialize: function () {
      // Weird. We're rendering from the initialize(). Probably don't do this.
      var template = Handlebars.compile(templates.blogView);
      this.$el.html( template(this.model.toJSON()) );
    }
  });

  // View for the entire app.
  var AppView = Backbone.View.extend({
    el: '#main', // Where this is going to end up on the page.
    initialize: function () {
      this.$el.html( templates.appView ); // Not using Handlebars so no need to compile.
      this.list = $('#posts'); // Caching the #posts for later use.
    },

    render: function () {
      this.collection.each(function (post) {
        var view = new PostListView({ model: post} ); // New view for each post.
        this.list.append( view.render().el ); // Bung it on the end of the list.
      }, this); // Pass in `this` as the scope of our each().
      return this; // Allow chaining again.
    }
  });

  var AppRouter = Backbone.Router.extend({
    // Only 2 routes!
    routes: {
      '': 'index',
      'posts/:slug': 'getPost'
    },
    initialize: function (options) {
      this.options = options;
      // Lorem ipsum posts. Make these more interesting.
        this.posts = new Posts ([
          new Post({title: 'DIGITAL STRATEGY', slug: 't1', content: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'}),
          new Post({title: 'BRAND IDENTITY', slug: 't2', content: 'Branding content'}),
          new Post({title: 'USER EXPERIENCE', slug: 't3', content: 'Mobile UX expert - Apps and Sites, Responsive solutions'}),
          new Post({title: 'RESPONSIVE DESIGN', slug: 't4', content: 'Mobile-Tablet-Web'})
        ]);
    },

    // Init the app and show the list of blog posts.
    index: function () {
      var appView = new AppView({collection: this.posts});
      appView.render();
    },

    // Show a specific post.
    getPost: function (slug) {
      var post = this.posts.get(slug);
      new PostView({model: post});
    }
  });

  // Kick off.
  var app = new AppRouter();
  Backbone.history.start({pushState: true});

  // Here is how to bind to changes in the URL.
  Backbone.history.on('route', function () {
    var fragment = Backbone.history.getFragment();
    console.log('The user navigated to', fragment);
  });

});




