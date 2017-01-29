angular
    .module('altairApp')
    .controller('ckeditorInlineCtrl', [
        '$scope',
        function ($scope) {

            $scope.ckeditor_inline =
                '<h2 class="heading_b">Heading Lorem ipsum dolor sit amet.</h2>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, cupiditate, odit. Beatae doloremque excepturi harum modi, nam neque nihil nobis, perspiciatis quam quo quos rem sed, velit. Accusantium alias autem ducimus eos et exercitationem explicabo fuga iure iusto labore laboriosam maiores, modi provident, quibusdam quos reiciendis suscipit velit vero voluptas?</p>' +
                '<h3 class="heading_a">Heading Lorem ipsum.</h3>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad culpa dignissimos ea facere, nobis non numquam quae quo reprehenderit! Alias beatae consequuntur, ducimus est facilis nihil odit rem totam ullam! Ad aspernatur consequatur dolores exercitationem illo incidunt iste labore laudantium modi, mollitia nobis quidem reprehenderit ut vero voluptas. Eaque expedita facilis id illum ipsam officiis porro unde! Ab architecto, blanditiis corporis fuga harum optio, porro provident quia quidem tempore totam ut, vitae voluptatibus. Autem laboriosam, repudiandae. Cupiditate esse et fuga, libero magni minima quas rem sit tempore totam voluptates voluptatum. Consequatur dolor facere, incidunt ipsum libero minus neque obcaecati voluptas.</p>';

            $scope.ckeditor_options = {
                customConfig: '../../assets/js/custom/ckeditor_config.js',
                allowedContent: true
            }

        }
    ]);