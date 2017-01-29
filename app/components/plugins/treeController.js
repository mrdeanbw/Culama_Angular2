angular
    .module('altairApp')
    .controller('treeCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        function ($rootScope,$scope,$timeout) {

            $timeout(function() {

                // single selection
                $("#tA").fancytree({
                    checkbox: true,
                    selectMode: 1,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });

                // multiple selection
                $("#tB").fancytree({
                    checkbox: true,
                    selectMode: 3,
                    imagePath: "assets/icons/others/",
                    extensions: ["dnd", "wide"],
                    autoScroll: true,
                    activate: function(event, data) {
                        var node = data.node;
                        // Use <a> href and target attributes to load the content:
                        if( node.data.href ){
                            // Open target
                            window.open(node.data.href, node.data.target);
                        }
                    }
                });


                // Filters
                var $tFilter = $("#tFilter");
                $tFilter.fancytree({
                    extensions: ["filter"],
                    quicksearch: true,
                    source: {
                        url: "data/fancytree/ajax-tree-local.json"
                    },
                    filter: {
                        autoApply: true,  // Re-apply last filter if lazy data is loaded
                        counter: true,  // Show a badge with number of matching child nodes near parent icons
                        fuzzy: false,  // Match single characters in order, e.g. 'fb' will match 'FooBar'
                        hideExpandedCounter: true,  // Hide counter badge, when parent is expanded
                        highlight: true,  // Highlight matches by wrapping inside <mark> tags
                        mode: "dimm"  // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                    },
                    activate: function(event, data) {
                        // alert("activate " + data.node);
                    },
                    lazyLoad: function(event, data) {
                        data.result = {
                            url: "data/fancytree/ajax-sub2.json"
                        }
                    }
                });
                var tree = $tFilter.fancytree("getTree");


                $("#filter_input").keyup(function(e){
                    var n,
                        opts = {
                            autoExpand: $("#autoExpand").is(":checked"),
                            leavesOnly: $("#leavesOnly").is(":checked")
                        },
                        match = $(this).val();

                    if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === ""){
                        $("#tree_filter_reset").click();
                        return;
                    }

                    if($("#tree_filter_regex").is(":checked")) {
                        // Pass function to perform match
                        n = tree.filterNodes(function(node) {
                            return new RegExp(match, "i").test(node.title);
                        }, opts);
                    } else {
                        // Pass a string to perform case insensitive matching
                        n = tree.filterNodes(match, opts);
                    }
                    $("#tree_filter_reset").attr("disabled", false);

                });

                // reset filter
                $scope.resetFilters = function($event) {
                    $scope.tree.filterInput = '';
                    tree.clearFilter();
                };
                
                $("#filter_switches").find("input:checkbox").on('ifChanged', function(e){
                    var id = $(this).attr("id"),
                        flag = $(this).is(":checked");

                    switch( id ) {
                        case "autoExpand":
                        case "regex":
                        case "leavesOnly":
                            // Re-apply filter only
                            break;
                        case "hideMode":
                            tree.options.filter.mode = flag ? "hide" : "dimm";
                            break;
                        case "counter":
                        case "fuzzy":
                        case "hideExpandedCounter":
                        case "highlight":
                            tree.options.filter[id] = flag;
                            break;
                    }
                    tree.clearFilter();
                    $("#filter_input").keyup();
                });

                // activate filters
                $scope.tree = {
                    counter: true,
                    hideExpandedCounter: true,
                    highlight: true
                };

            });

        }
    ]);