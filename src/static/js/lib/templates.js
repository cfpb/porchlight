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
    "			<input type=\"text\" placeholder='Start by entering a repo name...' ng-model=\"dashboardHeaderCtrl.selected\" typeahead-wait-ms=\"2\"typeahead=\"data.name for data in dashboardHeaderCtrl.searchRepos($viewValue)\" typeahead-on-select=\"dashboardHeaderCtrl.selectRepo($item)\"   class=\"input__super\" />\n" +
    "			<button ng-click=\"dashboardHeaderCtrl.clear()\" ng-show=\"dashboardHeaderCtrl.selected\" class=\"btn btn__super clear_btn btn_link btn__secondary\">\n" +
    "				<span class=\"u-visually-hidden\">Clear</span>\n" +
    "				<span class=\"cf-icon cf-icon-delete\"></span>\n" +
    "			</button>\n" +
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
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("views/dashboardMainView.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/dashboardMainView.tpl.html",
    "<div ui-view class='wrapper'>\n" +
    "	<section id=\"dashboard-main\">\n" +
    "		<highchart id=\"chart1\" config=\"dashboardMainCtrl.chartConfig\"></highchart>\n" +
    "		<table id=\"data-table\">\n" +
    "			<thead>\n" +
    "				<tr class=\"header\">\n" +
    "					<th>Domain</th>\n" +
    "					<th>Project</th>\n" +
    "					<th>Repo</th>\n" +
    "					<th>Commit</th>\n" +
    "					<th>Commit Date</th>\n" +
    "					<th>Deploy Date</th>\n" +
    "					<th>Cumulative Unshipped</th>\n" +
    "				</tr>\n" +
    "			</thead>\n" +
    "			<tbody>\n" +
    "				<tr ng-repeat=\"repo in dashboardMainCtrl.repositories\">\n" +
    "					<td>{{repo.domain}}</td>\n" +
    "					<td>{{repo.project}}</td>\n" +
    "					<td><a ng-href=\"{{repo.url}}\" target=\"_new\">{{repo.name}}</a></td>\n" +
    "					<td class=\"commit_hash\">{{repo.undeployed_identifier}}</td>\n" +
    "					<td>{{repo.undeployed_datetime  | date:'MM/dd/yyyy'}}</td>\n" +
    "					<td>{{repo.deployed_datetime | date:'MM/dd/yyyy'}}</td>\n" +
    "					<td>{{repo.value}}</td>\n" +
    "				</tr>\n" +
    "			</tbody>\n" +
    "			<tfoot>\n" +
    "				<tr>\n" +
    "					<td colspan=7>  <pagination boundary-links=\"true\" items-per-page=\"dashboardMainCtrl.pageSize\" total-items=\"dashboardMainCtrl.totalItems\" ng-model=\"dashboardMainCtrl.currentPage\" ng-change=\"dashboardMainCtrl.pageChanged()\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\"></pagination>\n" +
    "					</td>\n" +
    "				</tr>\n" +
    "			<tfoot>\n" +
    "\n" +
    "				</table>\n" +
    "\n" +
    "\n" +
    "			</section>\n" +
    "		</div>\n" +
    "\n" +
    "");
}]);
