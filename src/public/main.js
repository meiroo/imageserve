'use strict';

require.config({
    baseUrl: '',
    paths: {
        angular: "js/angular",
        "angular-route": "js/angular-route",
        plugins:'controller/plugins',
        api: 'controller/api',
        app:'controller/app',
        title:'controller/title',
        uploaddlg:'controller/folderDlg',
        imageSpace:'controller/ImageSpace',
        foldernew:'controller/foldernew',
        folderrm:'controller/folderrm'

    },
    shim: {
        angular: {
            exports: "angular"
        },
        "angular-route":{
            exports:"angular-route",
            deps: ["angular"]
        }
      

    }
});

window.name = "NG_DEFER_BOOTSTRAP!";

$(document).ready(function() {
    require(['angular','angular-route','app'],function(angular,route,app){
        var $html = angular.element(document.getElementsByTagName('html')[0]);

        angular.element().ready(function() {
            angular.resumeBootstrap([app['name']]);
        });
    });
});
