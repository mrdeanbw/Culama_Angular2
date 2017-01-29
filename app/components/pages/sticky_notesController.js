angular
    .module('altairApp')
    .controller('sticky_notesCtrl', [
        '$rootScope',
        '$scope',
        '$window',
        '$timeout',
        function ($rootScope,$scope,$window,$timeout) {

            $rootScope.toBarActive = true;
            // hide note form on page load
            $rootScope.noteFormActive = false;

            $scope.$on('$destroy', function() {
                $rootScope.toBarActive = false;
                $rootScope.noteFormActive = false;
            });

            $scope.randID_generator = function() {
                var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                return randLetter + Date.now();
            };

            // default note labels
            $scope.notes_labels = [
                {
                    'text': 'label 1',
                    'text_safe': 'label-1',
                    'type': 'default'
                },
                {
                    'text': 'label 2',
                    'text_safe': 'label-2',
                    'type': 'warning'
                },
                {
                    'text': 'label 3',
                    'text_safe': 'label-3',
                    'type': 'danger'
                },
                {
                    'text': 'label 4',
                    'text_safe': 'label-4',
                    'type': 'success'
                },
                {
                    'text': 'label 5',
                    'text_safe': 'label-5',
                    'type': 'primary'
                }
            ];
            $scope.notes_temp = [
                {
                    'time': 1475604600000,
                    'color': 'md-bg-red-100',
                    'title': 'Lorem impsum dolor sit',
                    'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam molestias quidem repellendus saepe vero! Assumenda fugiat perferendis reiciendis repellat voluptas?',
                    'labels': [
                        {
                            'type': 'primary',
                            'text': 'label 5',
                            'text_safe': 'label-5'
                        }
                    ]
                },
                {
                    'time': 1475691265322,
                    'title': 'Lorem ipsum',
                    'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam molestias quidem repellendus saepe vero!',
                    'labels': [
                        {
                            'type': 'default',
                            'text': 'label 1',
                            'text_safe': 'label-1'
                        }
                    ],
                    'checklist': [
                        {
                            'checked': false,
                            'title': 'first item'
                        },
                        {
                            'checked': true,
                            'title': 'second item'
                        },
                        {
                            'checked': false,
                            'title': 'third item'
                        },
                        {
                            'checked': false,
                            'title': 'fourth item'
                        }
                    ]
                },
                {
                    'time': 1475691265322,
                    'color': 'md-bg-green-100',
                    'title': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
                    'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda fugiat perferendis reiciendis repellat voluptas?',
                    'labels': [
                        {
                            'type': 'warning',
                            'text': 'label 2',
                            'text_safe': 'label-2'
                        },
                        {
                            'type': 'danger',
                            'text': 'label 3',
                            'text_safe': 'label-3'
                        }
                    ]
                },
                {
                    'time': 1475604600000,
                    'color': 'md-bg-yellow-100',
                    'title': 'Lorem impsum dolor sit',
                    'content': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam molestias quidem repellendus saepe vero! Assumenda fugiat perferendis reiciendis repellat voluptas?',
                    'labels': [
                        {
                            'type': 'success',
                            'text': 'label 4',
                            'text_safe': 'label-4'
                        },
                        {
                            'type': 'primary',
                            'text': 'label 5',
                            'text_safe': 'label-5'
                        }
                    ]
                }
            ];
            $scope.notes = [];
            // add filters to array item
            angular.forEach($scope.notes_temp, function(value, key) {
                $scope.notes.push(value);
                var filters = '';
                angular.forEach(value.labels, function(val,k) {
                    //var labels = val.text_safe.join(";");
                    var delimeter =  k>0 ? ',' : '';
                    filters += (delimeter + val.text_safe);
                });
                $scope.notes[key].filterBy = filters;
            });

            // close note
            $scope.closeNote = function($event,index) {
                $event.preventDefault();
                var $this_note = $($event.currentTarget).closest('.md-card').parent();
                $this_note.addClass('uk-animation-scale-up uk-animation-reverse');
                $timeout(function() {
                    $scope.notes[index].hidden = true;
                },300);
            };

            // form
            $scope.showNoteForm = function($event) {
                $event.preventDefault();
                $rootScope.noteFormActive = true;
            };

            // note color picker
            $scope.color_picker = function(object,pallete) {
                if(object) {
                    var cp_id = 'cp_1',
                        cp_pallete = pallete ? pallete : ['md-bg-white','md-bg-red-500','md-bg-pink-500','md-bg-purple-500','md-bg-indigo-500','md-bg-blue-500','md-bg-cyan-500','md-bg-teal-500','md-bg-green-500','md-bg-lime-500','md-bg-yellow-500','md-bg-amber-500','md-bg-brown-500','md-bg-blue-grey-500'],
                        cp_pallete_length = cp_pallete.length,
                        cp_wrapper = $('<div class="cp_altair" id="'+cp_id+'"/>');

                    for(var $i=0;$i<cp_pallete_length;$i++) {
                        var span = (cp_pallete[$i].substring(0, 6) == "md-bg-" ) ?
                        '<span data-color=' + cp_pallete[$i] + ' class="' + cp_pallete[$i] + '"></span>'
                            :
                        '<span data-color=' + cp_pallete[$i] + ' style="background:' + cp_pallete[$i] + '"></span>';
                        cp_wrapper.append(span);
                    }

                    function replaceColor(color) {
                        if(color) {
                            var replaceColor = color.split('-'),
                                lastEl = replaceColor[replaceColor.length -1];
                            if(!isNaN(lastEl)) {
                                replaceColor.pop();
                                var replacedColor = replaceColor.join('-') + '-100'
                            } else {
                                var replacedColor = replaceColor.join('-')
                            }
                            return replacedColor;
                        } else {
                            return false;
                        }
                    }

                    $('body').on('click', '#'+cp_id+' span',function() {
                        $(this)
                            .addClass('active_color')
                            .siblings().removeClass('active_color');

                        $scope.note_form.color = replaceColor($(this).attr('data-color'));

                        if(typeof callback == 'function') {
                            callback.call(this);
                        }
                    });
                    return object.append(cp_wrapper);
                }
            };
            $scope.noteColorPicker = $scope.color_picker($('<div id="calendar_colors_wrapper"></div>')).prop('outerHTML');

            // default note form values
            $scope.note_form = {
                title: '',
                content: '',
                checklist: []
            };

            // add checklist item
            function checklist_item_add() {
                if($scope.note_form.checklist_item_title != '') {
                    $scope.note_form.checklist.push({
                        id: $scope.randID_generator(),
                        title: $scope.note_form.checklist_item_title
                    });
                    $scope.note_form.checklist_item_title = '';
                }
            }
            // on '+' click
            $scope.checkboxAddClick = function($event) {
                $event.preventDefault();
                checklist_item_add();
            };
            // on 'enter' key
            $scope.checkboxAddKey = function($event) {
                var key = $event.which || $event.keyCode;
                if(key == 13) {
                    checklist_item_add();
                }
            };

            // add note
            $scope.noteAdd = function($event) {
                $event.preventDefault();

                var $title_input = $('#note_f_title'),
                    $content_input = $('#note_f_content');

                $title_input.removeClass('md-input-danger');
                $content_input.removeClass('md-input-danger');

                if($scope.note_form.title == '') {
                    $title_input.addClass('md-input-danger').focus();
                    return;
                }

                if($scope.note_form.content == '') {
                    $content_input.addClass('md-input-danger').focus();
                    return;
                }

                var labels = [];
                angular.forEach($scope.notes_labels, function(value, key) {
                    if(value.checked) {
                        labels.push(value);
                    }
                });

                var filter = '';
                if(labels) {
                    angular.forEach(labels, function(val,k) {
                        var delimeter =  (k > 0) ? ',' : '';
                        filter += (delimeter + val.text_safe);
                    })
                }

                $scope.notes.push({
                    'time': new Date().getTime(),
                    'color': $scope.note_form.color,
                    'title':  $scope.note_form.title,
                    'content': $scope.note_form.content.replace(/\n/g, '<br />'),
                    'labels': labels,
                    'checklist': $scope.note_form.checklist,
                    'filterBy': filter
                });
                $timeout(function() {
                    $scope.note_form = {
                        title: '',
                        content: '',
                        checklist: []
                    };
                    $rootScope.noteFormActive = false;
                    angular.forEach($scope.notes_labels, function(value, key) {
                        value.checked = false;
                    });
                })
            };

            // clear form
            $scope.clearForm = function($event) {
                $event.preventDefault();
                $scope.note_form = {
                    title: '',
                    content: '',
                    checklist: []
                };
                angular.forEach($scope.notes_labels, function(value, key) {
                    value.checked = false;
                });
                $('#cp_1').find('.active_color').removeClass('active_color');
            }

        }
    ]);