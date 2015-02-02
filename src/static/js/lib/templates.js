angular.module('templates-main', ['views/footerView.tpl.html', 'views/headerView.tpl.html', 'views/mainView.tpl.html', 'views/dashboardView.tpl.html']);

angular.module("views/footerView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/footerView.tpl.html",
    "<!-- Footer stuff -->");
}]);

angular.module("views/headerView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/headerView.tpl.html",
    "<div class='title-ctr'>\n" +
    "	 <h1 class=\"site-title title-link\">Porchlight</h1>\n" +
    "</div>\n" +
    "<div class='logo-ctr'>\n" +
    "	<img src=\"./static/images/cfpb_logo.png\" class=\"logo\" alt=\"Consumer Financial Protection Bureau\" width=\"151\">\n" +
    "</div>\n" +
    "");
}]);

angular.module("views/mainView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/mainView.tpl.html",
    "<div ui-view class='content__1-3'/>");
}]);

angular.module("views/dashboardView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardView.tpl.html",
    "<aside id=\"dashboard-sidebar\" class=\"content_sidebar active\" ng-class=\"{active:sidebarCtrl.active}\" ng-controller=\"dashboardSidebarController as sidebarCtrl\">\n" +
    "	<div id=\"sidebar-search-ctr\">\n" +
    "		<button id=\"sidebar-toggle\" class=\"btn btn__link btn__secondary\"  ng-click=\"sidebarCtrl.toggle()\">\n" +
    "			<span class=\"cf-icon cf-icon-left\"></span>\n" +
    "		</button>\n" +
    "		<div class=\"btn-inside-input\">\n" +
    "			<input type=\"search\" placeholder=\"Search for repos\">\n" +
    "			<button class=\"btn btn__link btn__secondary\">\n" +
    "				<span class=\"cf-icon cf-icon-search\" ></span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</aside>\n" +
    "<section id=\"dashboard-main\" class=\"content_main\" ng-controller=\"dashboardMainController as mainCtrl\">\n" +
    "	 <highchart id=\"chart1\" config=\"mainCtrl.chartConfig\" class=\"span10\"></highchart>\n" +
    "	 <table id=\"data-table\">\n" +
    "			<thead>\n" +
    "			<tr class=\"header\">\n" +
    "				<th>Domain</th>\n" +
    "				<th>Project</th>\n" +
    "				<th>Repo</th>\n" +
    "                <th>Commit</th>\n" +
    "                <th>Commit Date</th>\n" +
    "                <th>Deploy Date</th>\n" +
    "				<th>Cumulative Unshipped</th>\n" +
    "			</tr>\n" +
    "			</thead>\n" +
    "		</table>\n" +
    "\n" +
    "</section>");
}]);
