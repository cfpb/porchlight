angular.module('templates-main', ['views/dashboardFooterView.tpl.html', 'views/dashboardHeaderView.tpl.html', 'views/dashboardMainView.tpl.html']);

angular.module("views/dashboardFooterView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardFooterView.tpl.html",
    "<!-- Footer stuff -->");
}]);

angular.module("views/dashboardHeaderView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardHeaderView.tpl.html",
    "<div class=\"content_wrapper\">\n" +
    "	<div class='title-ctr u-w25pct'>\n" +
    "		<h1 class=\"site-title title-link\">Porchlight</h1>\n" +
    "	</div>\n" +
    "	<div class='search-ctr u-w50pct'>\n" +
    "		<div class=\"btn-inside-input\">\n" +
    "			<input type=\"text\" placeholder='Start by enter a repo name...' ng-model=\"dashboardHeaderCtrl.selected\" typeahead=\"data.domain for data in dashboardHeaderCtrl.data | filter:$viewValue | limitTo:8\" class=\"input__super\" />\n" +
    "			<button class=\"btn btn__super btn_link btn__secondary\">\n" +
    "				<span class=\"u-visually-hidden\">Search</span>\n" +
    "				<span class=\"cf-icon cf-icon-search\"></span>\n" +
    "			</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class='logo-ctr u-w20pct'>\n" +
    "		<div></div>\n" +
    "		<img src=\"./static/images/cfpb_logo.png\" class=\"logo\" alt=\"Consumer Financial Protection Bureau\" width=\"151\">\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("views/dashboardMainView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardMainView.tpl.html",
    "<div ui-view class='wrapper'><!-- \n" +
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
    "</aside> -->\n" +
    "<section id=\"dashboard-main\" ng-controller=\"dashboardMainController as mainCtrl\">\n" +
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
    "	</table>\n" +
    "</section>\n" +
    "</div>");
}]);
