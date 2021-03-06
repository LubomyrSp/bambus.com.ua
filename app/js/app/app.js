/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, requirejs */


define(['backbone', 'preloader', 'menu'], function (Backbone, preloader, Menu) {
    'use strict';
    var application,
    App = Backbone.Router.extend({
        rewrites: {
            projects: {}
        },
        projectPages: {},
        initialize: function () {
            var _self = this;

            /* prevent defaults */
            document.documentElement.addEventListener('click', function (event) {
                var target = event.target;
                while (target && target.nodeName !== 'A') {
                    target = target.parentNode;
                }
                if (target) {
                    if (target.hostname === window.location.hostname) {
                        event.preventDefault();
                        _self.navigate(target.pathname, true);
                    }
                }
            }, true);
            
            /* save current state */
            this.currentPage = {
                path: 'home',
                params: []
            };

            this.on("route", function (route, params) {
                /* save current state */
                this.currentPage = {
                    path: ((route !== '/') ? route.split('/')[0] : "home"),
                    params: params
                };
            }.bind(this));
            
            /* start history */
            Backbone.history.start({pushState: true});
        },
        widget: {
            menu: new Menu()
        },
        pages: {},
        routes: {
            "": "home",
            "/": "home",
            //English language route
            "en": "homeEng",
            "en/": "homeEng",
            
            "about": "about",
            //English language route
            "en/about": "aboutEng",
            
            "contacts": "contacts",
            //English language route
            "en/contacts": "contactsEng",
            
            "showreel": "showreel",
            
            "portfolio": "portfolio",
            "portfolio/:project": "project",
            
            "services": "services",
            "services/:service": "service",
            //English language route
            "en/services/:service": "serviceEng",
            
            "*notFound": "notFound"
        },
        home: function () {
            requirejs(['homepage'], function (Home) {
                new Home();
            });
        },
        homeEng: function () {
            var lang = 'en';
            requirejs(['homepage'], function (Home) {
                new Home({language: lang});
            });
        },
        
        about: function () {
            requirejs(['about'], function (About) {
                new About();
            });
        },
        aboutEng: function () {
            var lang = 'en';
            requirejs(['about'], function (About) {
                new About({language: lang});
            });
        },
        
        contacts: function () {
            requirejs(['contacts'], function (Contacts) {
                new Contacts();
            });
        },
        contactsEng: function () {
            var lang = 'en';
            requirejs(['contacts'], function (Contacts) {
                new Contacts({language: lang});
            });
        },
        
        showreel: function () {
            requirejs(['showreel'], function (Reel) {
                new Reel();
            });
        },
        
        portfolio: function () {
            requirejs(['portfolio'], function (Portfolio) {
                new Portfolio();
            });
        },
        
        service: function(page) {
            //check if page module file exist, prevent 404 error
            if (page === 'web') {
                requirejs(['service-' + page], function(Service) {
                    new Service();
                });
            } else {
                this.navigate('notFound', {trigger: true});
            }
        },
        serviceEng: function(page) {
            var lang = 'en';
            if (page === 'web') {
                requirejs(['service-' + page], function(Service) {
                    new Service({language: lang});
                });
            } else {
                this.navigate('notFound', {trigger: true});
            }
        },

        project: function (slug) {
            var self = this;
            requirejs(['project'], function (Project) {
                console.log(self.rewrites.projects)
                self.projectPages[slug] = new Project({id: slug, name: slug});
            });
        },

        notFound: function () {
            requirejs(['page404'], function (Notfoundpage) {
                new Notfoundpage();
            });
            $('#preloader').hide();
         }
    });
    application = new App();
    return application;

});


