// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', function () {
    var dropdownTriggers = document.querySelectorAll('[data-bs-toggle="collapse"]');

    dropdownTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (event) {
            var currentDropdown = document.querySelector(this.getAttribute('href'));

            // Cerrar otros dropdowns
            var openDropdowns = document.querySelectorAll('.collapse.show');
            openDropdowns.forEach(function (dropdown) {
                if (dropdown !== currentDropdown) {
                    var collapseInstance = bootstrap.Collapse.getInstance(dropdown);
                    collapseInstance.hide();
                }
            });
        });
    });
});
