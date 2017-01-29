angular
    .module('altairApp')
    .controller('image_cropperCtrl', [
        '$scope',
        function ($scope) {

            var console = window.console || { log: function () {} };
            var $image = $('#image_cropper');
            var $download = $('#image_download');
            var options = {
                aspectRatio: 16 / 9,
                preview: '.cr_preview'
            };

            $image.one("load", function() {

                // Cropper
                $image.on({
                    'build.cropper': function (e) {
                        console.log(e.type);
                    },
                    'built.cropper': function (e) {
                        console.log(e.type);
                    },
                    'cropstart.cropper': function (e) {
                        console.log(e.type, e.action);
                    },
                    'cropmove.cropper': function (e) {
                        console.log(e.type, e.action);
                    },
                    'cropend.cropper': function (e) {
                        console.log(e.type, e.action);
                    },
                    'crop.cropper': function (e) {
                        console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
                    },
                    'zoom.cropper': function (e) {
                        console.log(e.type, e.ratio);
                    }
                }).cropper(options);

                // Buttons
                if (!$.isFunction(document.createElement('canvas').getContext)) {
                    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
                }

                if (typeof document.createElement('cropper').style.transition === 'undefined') {
                    $('button[data-method="rotate"]').prop('disabled', true);
                    $('button[data-method="scale"]').prop('disabled', true);
                }

                // Download
                console.log(typeof $download[0].download === 'undefined');
                if (typeof $download[0].download === 'undefined') {
                    $download.addClass('disabled');
                }

                // Options
                $('.croper-toggles').on('click', 'button', function () {
                    if($(this).hasClass('uk-active')) {
                        var $this = $(this),
                            value = $this.attr('data-value');

                        if (!$image.data('cropper')) {
                            return;
                        }

                        $image.cropper('setAspectRatio',value);
                    }
                });

                // Methods
                $('.cropper-buttons').on('click', '[data-method]', function () {
                    var $this = $(this);
                    var data = $this.data();
                    var $target;
                    var result;

                    if ($this.prop('disabled') || $this.hasClass('disabled')) {
                        return;
                    }

                    if ($image.data('cropper') && data.method) {
                        data = $.extend({}, data); // Clone a new one

                        if (typeof data.target !== 'undefined') {
                            $target = $(data.target);

                            if (typeof data.option === 'undefined') {
                                try {
                                    data.option = JSON.parse($target.val());
                                } catch (e) {
                                    console.log(e.message);
                                }
                            }
                        }

                        result = $image.cropper(data.method, data.option, data.secondOption);

                        switch (data.method) {
                            case 'scaleX':
                            case 'scaleY':
                                $(this).data('option', -data.option);
                                break;

                            case 'getCroppedCanvas':
                                if (result) {

                                    var modalId = '#getCroppedCanvasModal',
                                        modal = UIkit.modal(modalId);

                                    $(modalId).find('.canvasModalImage').html(result);
                                    modal.show();

                                    if (!$download.hasClass('disabled')) {
                                        $download.attr('href', result.toDataURL('image/jpeg'));
                                    }
                                }

                                break;
                        }

                        if ($.isPlainObject(result) && $target) {
                            try {
                                $target.val(JSON.stringify(result));
                            } catch (e) {
                                console.log(e.message);
                            }
                        }

                    }
                });

                // Keyboard
                $(document.body).on('keydown', function (e) {

                    if (!$image.data('cropper') || this.scrollTop > 300) {
                        return;
                    }

                    switch (e.which) {
                        case 37:
                            e.preventDefault();
                            $image.cropper('move', -1, 0);
                            break;

                        case 38:
                            e.preventDefault();
                            $image.cropper('move', 0, -1);
                            break;

                        case 39:
                            e.preventDefault();
                            $image.cropper('move', 1, 0);
                            break;

                        case 40:
                            e.preventDefault();
                            $image.cropper('move', 0, 1);
                            break;
                    }

                });

                // Import image
                var $inputImage = $('#inputImage'),
                    $imageUrl;
                var URL = window.URL || window.webkitURL;
                var blobURL;

                if (URL) {
                    $inputImage.change(function () {
                        var files = this.files;
                        var file;

                        if (!$image.data('cropper')) {
                            return;
                        }

                        if (files && files.length) {
                            file = files[0];

                            if (/^image\/\w+$/.test(file.type)) {
                                blobURL = URL.createObjectURL(file);
                                $image.one('built.cropper', function () {

                                    // Revoke when load complete
                                    URL.revokeObjectURL(blobURL);
                                }).cropper('reset').cropper('replace', blobURL);
                                $inputImage.val('');
                                $imageUrl = blobURL;
                            } else {
                                window.alert('Please choose an image file.');
                            }
                        }
                    });
                } else {
                    $inputImage.prop('disabled', true).parent().addClass('disabled');
                }

            });

            $scope.$on('$destroy', function() {
                $image.cropper('destroy').off('build.cropper built.cropper cropstart.cropper cropmove.cropper cropend.cropper crop.cropper zoom.cropper', '**');
                $('.croper-toggles').off('click', 'button');
                $('.cropper-buttons').off('click', '[data-method]');
            });

        }
    ]);