angular
    .module('altairApp')
    .controller('context_menuCtrl', [
        '$scope',
        '$timeout',
        function ($scope,$timeout) {

            // text
            var cm_items_text = {
                'undo': {
                    name: "Undo",
                    icon: function(opt, $itemElement, itemKey, item){
                        console.log(item);
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE166;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    },
                    disabled: function(key, opt){
                        return true;
                    }
                },
                'redo': {
                    name: "Redo",
                    icon: function(opt, $itemElement, itemKey, item){
                        console.log(item);
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE15A;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                "sep1": "---------",
                'edit': {
                    name: "Edit",
                    icon: function(opt, $itemElement, itemKey, item){
                        console.log(item);
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE254;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'cut': {
                    name: "Cut",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE14E;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'copy': {
                    name: "Copy",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE14D;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'paste': {
                    name: "Paste",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE14F;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    },
                    disabled: function(key, opt){
                        return true;
                    }
                },
                'delete': {
                    name: "Delete",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE872;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material md-color-red-600';
                    }
                }
            };
            $.contextMenu({
                selector: '#context-text',
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                items: cm_items_text
            });

            //image
            var cm_items_image = {
                'edit': {
                    name: "Edit",
                    icon: function(opt, $itemElement, itemKey, item){
                        console.log(item);
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE254;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'replace': {
                    name: "Replace",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE042;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'archive': {
                    name: "Archive",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE149;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material';
                    }
                },
                'delete': {
                    name: "Delete",
                    icon: function(opt, $itemElement, itemKey, item){
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<i class="material-icons">&#xE872;</i> ' + item.name);

                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-material md-color-red-600';
                    }
                }
            };

            $.contextMenu({
                selector: '#context-image',
                callback: function(key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                items: cm_items_image
            });

        }
    ]);